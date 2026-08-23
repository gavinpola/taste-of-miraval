# Sleeper MCP

An MCP (Model Context Protocol) server for the [Sleeper](https://sleeper.com) fantasy football API, built for keeper decisions and draft domination.

Sleeper's API is public and read-only — no API key or login required.

## Setup

```bash
npm install
```

### Claude Code

This repo ships a project-scoped `.mcp.json`, so opening the repo in Claude Code picks the server up automatically. To register it globally instead:

```bash
claude mcp add sleeper -- npx tsx /path/to/this/repo/src/index.ts
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sleeper": {
      "command": "npx",
      "args": ["tsx", "/path/to/this/repo/src/index.ts"]
    }
  }
}
```

## Tools

| Tool | What it does |
| --- | --- |
| `get_nfl_state` | Current NFL season and week |
| `get_user` | Look up a user by username → `user_id` |
| `get_user_leagues` | A user's leagues for a season |
| `get_league` | League settings: scoring, roster slots, keeper count |
| `get_league_users` / `get_league_rosters` | Managers and full rosters with player names resolved |
| `get_league_drafts` / `get_draft` / `get_draft_picks` | Draft details, order, and every pick (with keeper flags) |
| `get_traded_picks` | Traded draft capital |
| `get_matchups` / `get_transactions` | Weekly scores and league activity |
| `search_players` | Player database search (name / position / team) |
| `get_trending_players` | Most added/dropped players across Sleeper |
| `get_season_leaders` | Actual fantasy points by season, position, and scoring format |
| `get_season_projections` | Projected points for the upcoming season |
| `analyze_keeper_candidates` | **The keeper tool** — your full roster with last-season production, projections, age, injuries, and last year's draft-round cost per player, plus league keeper settings |
| `sleeper_api_get` | Raw GET escape hatch for any other read-only endpoint |

## Keeper workflow

1. `get_user` with your username → `get_user_leagues` → find your league id.
2. `analyze_keeper_candidates` with the league id and your username.
3. Let Claude weigh projections vs. keeper cost (see `.claude/skills/draft-prep`) and pick your keepers.

## Development

```bash
npm run typecheck   # type-check
npm run smoke       # boots the server over stdio and lists tools
npm run build       # compile to dist/
```

Bulk data (player database, season stats/projections) is cached under the OS temp dir per Sleeper's guidance to avoid hammering their API.
