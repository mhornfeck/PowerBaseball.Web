# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

PowerBaseball.Web is the React/TypeScript frontend for a multiplayer baseball simulation game. It talks to a separate backend API (PowerBaseball) over REST and SignalR (real-time game state pushes) — this repo has no backend code. There are no tests configured in this project.

## Commands

```
npm run dev          # start Vite dev server (--host, so it's reachable on the LAN)
npm run build         # production build
npm run preview       # preview the production build
npm run lint          # eslint .
```

### Regenerating the API client

The API client under `src/api/generated` is generated from the backend's OpenAPI spec — never hand-edit it.

```
npm run api:pull      # fetch openapi.json from VITE_API_SPEC_URL (requires .env.local)
npm run api:codegen   # regenerate src/api/generated from src/api/openapi.json
npm run api:update    # both of the above
```

`.env.local` must define `VITE_API_SPEC_URL` (spec source) and the app's `.env`/`.env.local` must define `VITE_API_BASE_URL` (backend base URL, used both by the app at runtime and by the Vite dev server's `/api` proxy in `vite.config.js`).

## Architecture

**Screen flow.** `App.tsx` is a simple state machine over three screens (no router): `title` → `setup` → `game-runner`. `GameSetupScreen` itself has its own internal step state for new-game vs. join-game flows. Screen components live in `src/screens`; presentational/reusable pieces live in `src/components/<component-name>/` (each with its own `.tsx`/`.css`).

**Game state lives in two React contexts** (`src/context`), both mounted in `main.tsx` (`PlayerProvider` outside `GameProvider`):
- `PlayerContext` — the local player's identity: a `playerId` UUID persisted to `localStorage` (generated once per browser) and a `playerHandle` set at game-setup time.
- `GameContext` — the authoritative `GameState` (`GameEngineData` from the generated API) for the game currently being played, plus at-bat result/processing UI state. It also owns the SignalR connection lifecycle:
  - Connects to `${VITE_API_BASE_URL}/hubs/game` once on mount, joins the SignalR group for the current `game.gameId` whenever it changes (and rejoins `onreconnected`).
  - Listens for two push events (typed in `src/broadcasting/signalrEvents.ts` / `snapshots.ts`): `GameStateUpdated` (replaces `game`, and derives `isAtBatProcessing` from `stateType === "ResolveAtBat"`) and `AtBatResolved` (sets `lastAtBatResult`, clears processing).
  - So game state updates arrive from two sources: the initial REST response when starting/joining a game (`GameEngineService.postGameEngineNew` / `postGameEngineJoin`), and subsequent SignalR pushes as other players / the engine act.

**Player input** is submitted via `GameEngineService.postGameEngineEvent` with an `eventType` of `"batter-input"` or `"pitcher-input"`, carrying a `PitchInput` (`src/types/pitch.ts`: pitch type + horizontal/vertical location) — the result comes back asynchronously through the `AtBatResolved`/`GameStateUpdated` SignalR events above, not the POST response.

**Generated API client** (`src/api/generated`, openapi-typescript-codegen `fetch` client): `index.ts` re-exports everything, so import models/services from `../api/generated` rather than reaching into subpaths. `init.ts` sets `OpenAPI.BASE` from `VITE_API_BASE_URL` and is imported once for its side effect in `main.tsx`. Two services: `GameEngineService` (start/join/event) and `TeamsService` (team listings for setup).

**Local types vs. generated types.** `src/types` and `src/models` hold hand-written types for things the API doesn't shape the way the UI needs (e.g. `PitchInput`/`PitchLocation` in `types/pitch.ts`, `PlayerLine`/`AtBatResultType` in `types/game.ts`, `TeamSetup` in `models/TeamSetup.ts`). Generated equivalents from `src/api/generated/models` are used directly elsewhere (e.g. `Batter`, `GameTeam`, `GameEngineStateType`). When both exist for a concept, check which one a given component already imports before adding a new type.

**Path alias:** `@` → `src` (configured in `vite.config.js`), used inconsistently — most imports are relative.
