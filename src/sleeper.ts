import { readFile, writeFile, stat, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const V1 = "https://api.sleeper.app/v1";
const BASE = "https://api.sleeper.app";

export async function getJson<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Sleeper API ${res.status} ${res.statusText} for ${url}`);
  }
  return (await res.json()) as T;
}

// ---------- Basic endpoints ----------

export const getNflState = () => getJson<NflState>(`${V1}/state/nfl`);

export const getUser = (usernameOrId: string) =>
  getJson<SleeperUser>(`${V1}/user/${encodeURIComponent(usernameOrId)}`);

export const getUserLeagues = (userId: string, season: string) =>
  getJson<League[]>(`${V1}/user/${userId}/leagues/nfl/${season}`);

export const getLeague = (leagueId: string) => getJson<League>(`${V1}/league/${leagueId}`);

export const getLeagueRosters = (leagueId: string) =>
  getJson<Roster[]>(`${V1}/league/${leagueId}/rosters`);

export const getLeagueUsers = (leagueId: string) =>
  getJson<LeagueUser[]>(`${V1}/league/${leagueId}/users`);

export const getMatchups = (leagueId: string, week: number) =>
  getJson<unknown[]>(`${V1}/league/${leagueId}/matchups/${week}`);

export const getTransactions = (leagueId: string, week: number) =>
  getJson<unknown[]>(`${V1}/league/${leagueId}/transactions/${week}`);

export const getTradedPicks = (leagueId: string) =>
  getJson<unknown[]>(`${V1}/league/${leagueId}/traded_picks`);

export const getLeagueDrafts = (leagueId: string) =>
  getJson<Draft[]>(`${V1}/league/${leagueId}/drafts`);

export const getDraft = (draftId: string) => getJson<Draft>(`${V1}/draft/${draftId}`);

export const getDraftPicks = (draftId: string) =>
  getJson<DraftPick[]>(`${V1}/draft/${draftId}/picks`);

export const getTrendingPlayers = (type: "add" | "drop", lookbackHours: number, limit: number) =>
  getJson<{ player_id: string; count: number }[]>(
    `${V1}/players/nfl/trending/${type}?lookback_hours=${lookbackHours}&limit=${limit}`
  );

// Bulk season stats/projections. Keys are player ids; values include pts_ppr,
// pts_half_ppr, pts_std, gp, and per-stat detail.
export const getSeasonStats = (season: string) =>
  cachedJson<Record<string, PlayerSeasonStats>>(
    `${V1}/stats/nfl/regular/${season}`,
    `stats-${season}.json`,
    6 * 3600_000
  );

export const getSeasonProjections = (season: string) =>
  cachedJson<Record<string, PlayerSeasonStats>>(
    `${V1}/projections/nfl/regular/${season}`,
    `projections-${season}.json`,
    6 * 3600_000
  );

// ---------- Player database (large; Sleeper asks for at most one fetch/day) ----------

let playersMemo: Record<string, Player> | null = null;

export async function getPlayers(): Promise<Record<string, Player>> {
  if (playersMemo) return playersMemo;
  playersMemo = await cachedJson<Record<string, Player>>(
    `${V1}/players/nfl`,
    "players-nfl.json",
    24 * 3600_000
  );
  return playersMemo;
}

async function cachedJson<T>(url: string, cacheName: string, ttlMs: number): Promise<T> {
  const dir = join(tmpdir(), "sleeper-mcp-cache");
  const file = join(dir, cacheName);
  try {
    const s = await stat(file);
    if (Date.now() - s.mtimeMs < ttlMs) {
      return JSON.parse(await readFile(file, "utf8")) as T;
    }
  } catch {
    // no cache yet
  }
  const data = await getJson<T>(url);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(file, JSON.stringify(data));
  } catch {
    // cache write is best-effort
  }
  return data;
}

// ---------- Helpers ----------

export interface PlayerSummary {
  player_id: string;
  name: string;
  position: string | null;
  team: string | null;
  age: number | null;
  years_exp: number | null;
  injury_status: string | null;
  search_rank: number | null;
}

export function summarizePlayer(id: string, players: Record<string, Player>): PlayerSummary {
  const p = players[id];
  if (!p) {
    // Team defenses use the team abbreviation as their id.
    return {
      player_id: id,
      name: /^[A-Z]{2,3}$/.test(id) ? `${id} Defense` : `Unknown (${id})`,
      position: /^[A-Z]{2,3}$/.test(id) ? "DEF" : null,
      team: /^[A-Z]{2,3}$/.test(id) ? id : null,
      age: null,
      years_exp: null,
      injury_status: null,
      search_rank: null,
    };
  }
  return {
    player_id: id,
    name: p.full_name ?? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim(),
    position: p.position ?? null,
    team: p.team ?? null,
    age: p.age ?? null,
    years_exp: p.years_exp ?? null,
    injury_status: p.injury_status ?? null,
    search_rank: typeof p.search_rank === "number" && p.search_rank < 9999999 ? p.search_rank : null,
  };
}

/**
 * Determine the league's scoring bucket from its scoring settings so stats can
 * be reported in matching points (pts_ppr / pts_half_ppr / pts_std).
 */
export function scoringKey(league: League): "pts_ppr" | "pts_half_ppr" | "pts_std" {
  const rec = league.scoring_settings?.rec ?? 0;
  if (rec >= 0.75) return "pts_ppr";
  if (rec >= 0.25) return "pts_half_ppr";
  return "pts_std";
}

// ---------- Types (subset of Sleeper's responses that we rely on) ----------

export interface NflState {
  season: string;
  season_type: string;
  week: number;
  league_season: string;
  previous_season: string;
}

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
}

export interface League {
  league_id: string;
  name: string;
  season: string;
  status: string;
  total_rosters: number;
  roster_positions: string[];
  scoring_settings: Record<string, number>;
  settings: Record<string, number> & { max_keepers?: number };
  previous_league_id: string | null;
  draft_id: string | null;
}

export interface Roster {
  roster_id: number;
  owner_id: string | null;
  co_owners: string[] | null;
  players: string[] | null;
  starters: string[] | null;
  keepers: string[] | null;
  settings: Record<string, number>;
}

export interface LeagueUser {
  user_id: string;
  username?: string;
  display_name: string;
  metadata?: { team_name?: string };
  is_owner?: boolean;
}

export interface Draft {
  draft_id: string;
  league_id: string;
  season: string;
  status: string;
  type: string;
  settings: Record<string, number>;
  draft_order: Record<string, number> | null;
}

export interface DraftPick {
  player_id: string;
  picked_by: string;
  roster_id: string | number;
  round: number;
  pick_no: number;
  is_keeper: boolean | null;
  metadata?: Record<string, string>;
}

export interface Player {
  player_id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  position?: string;
  fantasy_positions?: string[];
  team?: string | null;
  age?: number | null;
  years_exp?: number | null;
  injury_status?: string | null;
  status?: string;
  search_rank?: number;
  active?: boolean;
}

export interface PlayerSeasonStats {
  pts_ppr?: number;
  pts_half_ppr?: number;
  pts_std?: number;
  gp?: number;
  [stat: string]: number | undefined;
}
