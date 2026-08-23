---
name: draft-prep
description: Keeper selection and draft strategy for the user's Sleeper fantasy football league. Use when the user asks about keepers, who to keep, draft prep, draft strategy, or their Sleeper league.
---

# Draft Prep: Keepers + Draft Strategy

The Sleeper MCP server (`.mcp.json` in this repo) provides all league data. Sleeper's API is read-only and public.

## Step 1 — Ground yourself in the actual league rules

Never assume settings. Fetch them:

1. `get_user` with the user's Sleeper username → user_id.
2. `get_user_leagues` for the current season → find the league (the user's league is named something like "Municipal").
3. `get_league` → note **scoring** (PPR/half/standard, TE premium, pass TD points), **roster positions** (superflex? 2QB? 3WR? flex count), **teams**, and `settings.max_keepers`.
4. `get_league_drafts` / `get_draft` → draft type (snake/auction), the user's draft slot if the order is set.
5. Ask the user (or check league bylaws) for the **keeper cost rule** — Sleeper stores max keepers but usually not the cost model. Common models: (a) costs the round the player was drafted last year, sometimes minus/plus a round; (b) costs nothing but a fixed late pick; (c) contract/escalating cost. The cost model changes everything.

## Step 2 — Run the keeper analysis

Call `analyze_keeper_candidates(league_id, username)`. It returns every rostered player with: last-season points and PPG *in the league's scoring*, current-season projection, age, injury status, and `last_draft_round` (null = undrafted pickup, typically the cheapest keeper).

## Step 3 — Value keepers as surplus, not as talent

For each candidate, the question is not "how good is this player?" but **"how much better is this player than what that draft slot would otherwise get me?"**

- Estimate the player's current market cost: compare projections/ADP (`get_season_projections`, `search_players` search_rank as a proxy) against the keeper cost round.
- **Keeper value ≈ (round the player would be drafted this year) − (round they cost to keep).** A WR going in round 2 who costs a round-9 keeper slot is +7 rounds of surplus. A stud costing a round-1 pick is usually ~0 surplus — you could just draft someone similar there.
- Adjust for: age cliffs (RBs ≥ 27, WRs ≥ 30), injury flags, situation changes (new team/QB/coach), league scoring quirks (TE premium inflates elite TEs; superflex inflates all QBs).
- Late-round breakout picks and undrafted waiver adds are almost always the best keepers. Early-round veterans almost never are.
- If the league's cost model is "no cost / fixed late pick," then simply keep the 3 highest projected players, adjusted for position scarcity.

Recommend up to `max_keepers` (3) with a clear ranking, the surplus math for each, and who to drop back into the pool and why.

## Step 4 — Draft strategy

After keepers are locked:

- **Reconstruct the post-keeper player pool**: pull all rosters' keepers (`get_league_rosters`) so you know who is *off the board* before pick 1, and re-rank the remaining pool with `get_season_projections` per position.
- **Positional scarcity math**: count starting slots across the league (teams × starters per position, flex-adjusted) vs. quality players remaining after keepers. Whatever position the league's keepers depleted most is where the draft will run early.
- **Tier, don't rank**: group remaining players into tiers per position; draft by tier cliff, not by overall rank. Take the last player in a collapsing tier over a mid-tier player elsewhere.
- **Plan around the user's slot**: from `get_draft` draft_order, simulate likely availability at each of their picks (snake math) and prepare 2–3 names per pick.
- **Exploit keeper-league dynamics**: managers who kept RBs will chase WRs early and vice versa; rookie/breakout candidates carry extra value in keeper leagues because of *next year's* surplus — factor that into late-round picks.
- Use `get_trending_players` in the days before the draft for late buzz, injuries, and camp risers the projections haven't caught.

## Output style

Deliver a decisive recommendation: the 3 keepers ranked with one-line justifications, then a round-by-round draft plan. No hedging walls — the user wants a game plan, not a survey.
