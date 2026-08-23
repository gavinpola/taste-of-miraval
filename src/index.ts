#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getDraft,
  getDraftPicks,
  getJson,
  getLeague,
  getLeagueDrafts,
  getLeagueRosters,
  getLeagueUsers,
  getMatchups,
  getNflState,
  getPlayers,
  getSeasonProjections,
  getSeasonStats,
  getTradedPicks,
  getTransactions,
  getTrendingPlayers,
  getUser,
  getUserLeagues,
  scoringKey,
  summarizePlayer,
  type League,
  type LeagueUser,
  type Roster,
} from "./sleeper.js";

const server = new McpServer({ name: "sleeper", version: "1.0.0" });

function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(err: unknown) {
  return {
    content: [{ type: "text" as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
    isError: true,
  };
}

const wrap =
  <A>(fn: (args: A) => Promise<unknown>) =>
  async (args: A) => {
    try {
      return json(await fn(args));
    } catch (err) {
      return errorResult(err);
    }
  };

// ---------- Core league/user tools ----------

server.tool(
  "get_nfl_state",
  "Current NFL season/week state per Sleeper (season, week, season_type).",
  {},
  wrap(async () => getNflState())
);

server.tool(
  "get_user",
  "Look up a Sleeper user by username or user_id. Returns user_id, username, display_name.",
  { username_or_id: z.string().describe("Sleeper username or numeric user_id") },
  wrap(async ({ username_or_id }) => getUser(username_or_id))
);

server.tool(
  "get_user_leagues",
  "List a user's NFL leagues for a season. Accepts username or user_id.",
  {
    username_or_id: z.string(),
    season: z.string().optional().describe("e.g. '2026'. Defaults to the current league season."),
  },
  wrap(async ({ username_or_id, season }) => {
    const user = await getUser(username_or_id);
    const s = season ?? (await getNflState()).league_season;
    const leagues = await getUserLeagues(user.user_id, s);
    return leagues.map((l) => ({
      league_id: l.league_id,
      name: l.name,
      season: l.season,
      status: l.status,
      total_rosters: l.total_rosters,
      max_keepers: l.settings?.max_keepers ?? null,
      draft_id: l.draft_id,
      previous_league_id: l.previous_league_id,
    }));
  })
);

server.tool(
  "get_league",
  "Full league object: scoring settings, roster positions, keeper settings, draft id, status.",
  { league_id: z.string() },
  wrap(async ({ league_id }) => getLeague(league_id))
);

server.tool(
  "get_league_users",
  "Managers in a league (user_id, display_name, team name).",
  { league_id: z.string() },
  wrap(async ({ league_id }) =>
    (await getLeagueUsers(league_id)).map((u) => ({
      user_id: u.user_id,
      display_name: u.display_name,
      team_name: u.metadata?.team_name ?? null,
      is_commissioner: u.is_owner ?? false,
    }))
  )
);

server.tool(
  "get_league_rosters",
  "All rosters in a league with player ids resolved to names/positions/teams, plus record and points.",
  { league_id: z.string() },
  wrap(async ({ league_id }) => {
    const [rosters, users, players] = await Promise.all([
      getLeagueRosters(league_id),
      getLeagueUsers(league_id),
      getPlayers(),
    ]);
    const byId = new Map(users.map((u) => [u.user_id, u]));
    return rosters.map((r) => resolveRoster(r, byId.get(r.owner_id ?? ""), players));
  })
);

function resolveRoster(
  r: Roster,
  owner: LeagueUser | undefined,
  players: Awaited<ReturnType<typeof getPlayers>>
) {
  return {
    roster_id: r.roster_id,
    owner: owner ? { user_id: owner.user_id, display_name: owner.display_name, team_name: owner.metadata?.team_name ?? null } : null,
    record: {
      wins: r.settings?.wins ?? 0,
      losses: r.settings?.losses ?? 0,
      ties: r.settings?.ties ?? 0,
      fpts: r.settings?.fpts ?? 0,
    },
    players: (r.players ?? []).map((id) => summarizePlayer(id, players)),
    starters: (r.starters ?? []).map((id) => summarizePlayer(id, players).name),
    keepers: (r.keepers ?? []).map((id) => summarizePlayer(id, players).name),
  };
}

// ---------- Draft tools ----------

server.tool(
  "get_league_drafts",
  "Drafts for a league (draft_id, status, type, settings, draft order).",
  { league_id: z.string() },
  wrap(async ({ league_id }) => getLeagueDrafts(league_id))
);

server.tool(
  "get_draft",
  "A single draft's details, including settings and draft_order (user_id -> slot).",
  { draft_id: z.string() },
  wrap(async ({ draft_id }) => getDraft(draft_id))
);

server.tool(
  "get_draft_picks",
  "All picks in a draft with player names resolved. Useful for keeper-cost rules based on last year's draft round.",
  { draft_id: z.string() },
  wrap(async ({ draft_id }) => {
    const [picks, players] = await Promise.all([getDraftPicks(draft_id), getPlayers()]);
    return picks.map((p) => ({
      round: p.round,
      pick_no: p.pick_no,
      player: summarizePlayer(p.player_id, players).name,
      player_id: p.player_id,
      position: summarizePlayer(p.player_id, players).position,
      picked_by_user_id: p.picked_by,
      roster_id: p.roster_id,
      is_keeper: p.is_keeper ?? false,
    }));
  })
);

server.tool(
  "get_traded_picks",
  "Traded draft picks in a league.",
  { league_id: z.string() },
  wrap(async ({ league_id }) => getTradedPicks(league_id))
);

// ---------- Season tools ----------

server.tool(
  "get_matchups",
  "Weekly matchups for a league (points by roster).",
  { league_id: z.string(), week: z.number().int().min(1).max(18) },
  wrap(async ({ league_id, week }) => getMatchups(league_id, week))
);

server.tool(
  "get_transactions",
  "League transactions (trades, waivers, free agents) for a given week.",
  { league_id: z.string(), week: z.number().int().min(1).max(18) },
  wrap(async ({ league_id, week }) => getTransactions(league_id, week))
);

// ---------- Player tools ----------

server.tool(
  "search_players",
  "Search the NFL player database by name, position, and/or team. Returns name, position, team, age, injury status, and Sleeper search_rank (lower = more relevant/valuable).",
  {
    query: z.string().optional().describe("Case-insensitive substring of the player's name"),
    position: z.enum(["QB", "RB", "WR", "TE", "K", "DEF"]).optional(),
    team: z.string().optional().describe("Team abbreviation, e.g. 'SF'"),
    limit: z.number().int().min(1).max(100).default(25),
  },
  wrap(async ({ query, position, team, limit }) => {
    const players = await getPlayers();
    const q = query?.toLowerCase();
    const results = Object.keys(players)
      .map((id) => summarizePlayer(id, players))
      .filter(
        (p) =>
          (!q || p.name.toLowerCase().includes(q)) &&
          (!position || p.position === position) &&
          (!team || p.team === team.toUpperCase())
      )
      .sort((a, b) => (a.search_rank ?? 1e9) - (b.search_rank ?? 1e9))
      .slice(0, limit);
    return results;
  })
);

server.tool(
  "get_trending_players",
  "Players trending on adds or drops across all of Sleeper — good waiver/hype signal.",
  {
    type: z.enum(["add", "drop"]).default("add"),
    lookback_hours: z.number().int().min(1).max(168).default(24),
    limit: z.number().int().min(1).max(50).default(25),
  },
  wrap(async ({ type, lookback_hours, limit }) => {
    const [trending, players] = await Promise.all([
      getTrendingPlayers(type, lookback_hours, limit),
      getPlayers(),
    ]);
    return trending.map((t) => ({ ...summarizePlayer(t.player_id, players), count: t.count }));
  })
);

server.tool(
  "get_season_leaders",
  "Top fantasy scorers for a season (actual stats), optionally filtered by position. scoring: ppr | half_ppr | std.",
  {
    season: z.string().describe("e.g. '2025'"),
    position: z.enum(["QB", "RB", "WR", "TE", "K", "DEF"]).optional(),
    scoring: z.enum(["ppr", "half_ppr", "std"]).default("half_ppr"),
    limit: z.number().int().min(1).max(200).default(50),
  },
  wrap(async ({ season, position, scoring, limit }) => {
    const key = `pts_${scoring}` as const;
    const [stats, players] = await Promise.all([getSeasonStats(season), getPlayers()]);
    return Object.entries(stats)
      .filter(([, s]) => typeof s?.[key] === "number")
      .map(([id, s]) => ({
        ...summarizePlayer(id, players),
        points: s[key],
        games: s.gp ?? null,
        ppg: s.gp ? Number(((s[key] ?? 0) / s.gp).toFixed(1)) : null,
      }))
      .filter((p) => !position || p.position === position)
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
      .slice(0, limit);
  })
);

server.tool(
  "get_season_projections",
  "Projected fantasy points for a season, optionally filtered by position. scoring: ppr | half_ppr | std.",
  {
    season: z.string().describe("e.g. '2026'"),
    position: z.enum(["QB", "RB", "WR", "TE", "K", "DEF"]).optional(),
    scoring: z.enum(["ppr", "half_ppr", "std"]).default("half_ppr"),
    limit: z.number().int().min(1).max(200).default(50),
  },
  wrap(async ({ season, position, scoring, limit }) => {
    const key = `pts_${scoring}` as const;
    const [proj, players] = await Promise.all([getSeasonProjections(season), getPlayers()]);
    return Object.entries(proj)
      .filter(([, s]) => typeof s?.[key] === "number" && (s[key] ?? 0) > 0)
      .map(([id, s]) => ({ ...summarizePlayer(id, players), projected_points: s[key] }))
      .filter((p) => !position || p.position === position)
      .sort((a, b) => (b.projected_points ?? 0) - (a.projected_points ?? 0))
      .slice(0, limit);
  })
);

// ---------- Keeper analysis ----------

server.tool(
  "analyze_keeper_candidates",
  "One-shot keeper analysis dataset: a manager's full roster with last-season points (in the league's scoring), next-season projections, age, injury status, last draft round paid for each player, and the league's keeper settings. Use this to decide which players to keep.",
  {
    league_id: z.string(),
    username_or_id: z.string().describe("The manager whose roster to analyze (Sleeper username or user_id)"),
  },
  wrap(async ({ league_id, username_or_id }) => {
    const [league, user, players, state] = await Promise.all([
      getLeague(league_id),
      getUser(username_or_id),
      getPlayers(),
      getNflState(),
    ]);
    const [rosters, users] = await Promise.all([getLeagueRosters(league_id), getLeagueUsers(league_id)]);
    const roster = rosters.find((r) => r.owner_id === user.user_id || (r.co_owners ?? []).includes(user.user_id));
    if (!roster) throw new Error(`No roster owned by ${user.display_name} in league ${league.name}`);

    const currentSeason = league.season || state.league_season;
    const priorSeason = String(Number(currentSeason) - 1);
    const key = scoringKey(league);
    const scoringLabel = key.replace("pts_", "");

    const [stats, projections, priorDraftCost] = await Promise.all([
      getSeasonStats(priorSeason).catch(() => ({}) as Record<string, never>),
      getSeasonProjections(currentSeason).catch(() => ({}) as Record<string, never>),
      lastSeasonDraftCost(league, players).catch(() => new Map<string, number>()),
    ]);

    const candidates = (roster.players ?? [])
      .map((id) => {
        const p = summarizePlayer(id, players);
        const s = (stats as Record<string, Record<string, number | undefined>>)[id];
        const pr = (projections as Record<string, Record<string, number | undefined>>)[id];
        return {
          ...p,
          [`${priorSeason}_points`]: s?.[key] ?? null,
          [`${priorSeason}_games`]: s?.gp ?? null,
          [`${priorSeason}_ppg`]: s?.gp && s?.[key] ? Number((s[key]! / s.gp!).toFixed(1)) : null,
          [`${currentSeason}_projected_points`]: pr?.[key] ?? null,
          last_draft_round: priorDraftCost.get(id) ?? null,
        };
      })
      .sort((a, b) => {
        const projKey = `${currentSeason}_projected_points`;
        const av = (a as unknown as Record<string, number | null>)[projKey] ?? 0;
        const bv = (b as unknown as Record<string, number | null>)[projKey] ?? 0;
        return bv - av;
      });

    return {
      league: {
        name: league.name,
        season: currentSeason,
        scoring: scoringLabel,
        max_keepers: league.settings?.max_keepers ?? null,
        roster_positions: league.roster_positions,
        teams: league.total_rosters,
        relevant_scoring_settings: pickScoring(league),
      },
      manager: user.display_name,
      keeper_candidates: candidates,
      notes:
        "Points use the league's own scoring bucket. last_draft_round is where the player was drafted in this league last season (null = undrafted/waiver pickup — often the cheapest keepers if your league charges a round). Cross-check keeper cost rules with the commissioner.",
    };
  })
);

/** Map player_id -> round drafted in the league's previous season draft. */
async function lastSeasonDraftCost(
  league: League,
  players: Awaited<ReturnType<typeof getPlayers>>
): Promise<Map<string, number>> {
  void players;
  const out = new Map<string, number>();
  if (!league.previous_league_id) return out;
  const drafts = await getLeagueDrafts(league.previous_league_id);
  const done = drafts.find((d) => d.status === "complete") ?? drafts[0];
  if (!done) return out;
  const picks = await getDraftPicks(done.draft_id);
  for (const p of picks) out.set(p.player_id, p.round);
  return out;
}

function pickScoring(league: League) {
  const keys = ["rec", "pass_td", "pass_yd", "rush_yd", "rec_yd", "rush_td", "rec_td", "pass_int", "fum_lost", "bonus_rec_te"];
  const out: Record<string, number> = {};
  for (const k of keys) {
    if (league.scoring_settings?.[k] !== undefined) out[k] = league.scoring_settings[k];
  }
  return out;
}

// ---------- Escape hatch ----------

server.tool(
  "sleeper_api_get",
  "Raw GET against any read-only Sleeper API path (https://api.sleeper.app). Use only when no dedicated tool fits. Example paths: /v1/league/<id>/winners_bracket",
  { path: z.string().describe("Path beginning with /v1/ or /") },
  wrap(async ({ path }) => {
    if (!path.startsWith("/")) throw new Error("Path must start with /");
    return getJson(`https://api.sleeper.app${path}`);
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Sleeper MCP server running on stdio");
