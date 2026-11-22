# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

PowerBaseball.Web is the React/TypeScript frontend for a multiplayer baseball simulation game. It talks to a separate backend API (PowerBaseball) over REST and SignalR (real-time game state pushes) — this repo has no backend code. Users must sign in (passwordless: Google or an emailed code) before playing.

## Commands

```
npm run dev          # start Vite dev server (--host, so it's reachable on the LAN)
npm run build         # typecheck + production build
npm run typecheck     # tsc --noEmit
npm run preview       # preview the production build
npm run lint          # eslint .
npm test              # vitest run (npm run test:watch to watch)
```

Unit tests are Vitest in the `node` environment (no DOM), colocated as `*.test.ts` next to the code they cover. Keep logic worth testing in plain `.ts` modules (e.g. `context/authUrl.ts`, `screens/loginErrors.ts`, `mappers/game.mapper.ts`) rather than inside components.

### Regenerating the API client

The API client under `src/api/generated` is generated from the backend's OpenAPI spec — never hand-edit it (the one exception is `init.ts`, see below).

```
npm run api:pull      # fetch openapi.json from VITE_API_SPEC_URL (requires .env.local)
npm run api:codegen   # regenerate src/api/generated from src/api/openapi.json
npm run api:update    # both of the above (the backend must be running)
```

The backend serves OpenAPI 3.1 but the generator only understands 3.0, so `scripts/codegen.mjs` rewrites the 3.1 constructs it mishandles before generating. `src/api/openapi.json` stays exactly what the backend serves. Commit a regenerated client on its own, separate from the code that uses it.

`.env.local` must define `VITE_API_SPEC_URL` (spec source) and the app's `.env`/`.env.local` must define `VITE_API_BASE_URL` (backend base URL). The app calls `VITE_API_BASE_URL` directly (cross-origin in dev); `vite.config.js` also has an `/api` proxy to it that the app doesn't currently use.

## Architecture

**Screen flow.** `App.tsx` is a simple state machine (no router). It first gates on auth: nothing while the session check is loading, `LoginScreen` when signed out, otherwise three screens `title` → `setup` → `game-runner`. `GameSetupScreen` has its own internal step state for new-game vs. join-game flows, and `LoginScreen` for choose-method vs. enter-code. Screen components live in `src/screens`; presentational/reusable pieces live in `src/components/<component-name>/` (each with its own `.tsx`/`.css`).

**Three React contexts** (`src/context`), mounted in `main.tsx` as `AuthProvider` > `PlayerProvider` > `GameProvider`:
- `AuthContext` — the signed-in user. The backend uses **cookie sessions**: nothing is stored client-side, and `GET /auth/me` (200 = signed in, 401 = signed out) is the only source of truth, checked once on startup.
  - Email sign-in: `sendCode` (`POST /auth/email/send`) then `verifyCode` (`POST /auth/email/verify`, which returns the user). Both throw `ApiError`; the backend returns 400 for a bad email/code and 429 when rate limited (mapped to messages in `screens/loginErrors.ts`).
  - Google sign-in is a full-page navigation, not a fetch: `loginWithGoogle` sends the browser to `/auth/google/login?returnUrl=...`; the backend redirects back to the frontend, with `?authError=...` on failure, which `AuthProvider` shows and strips from the URL. Don't call the generated `getAuthGoogleLogin`/`getAuthGoogleCallback`.
  - `handleUnauthorized` switches to signed out; nothing calls it yet.
  - The player's in-game name is `playerDisplayName(user)` (`context/displayName.ts`): `displayName`, falling back to the email before the `@`.
- `PlayerContext` — `playerId`, a UUID persisted to `localStorage` (generated once per browser). The game endpoints still take this id and a handle in the request body rather than reading the session.
- `GameContext` — the authoritative `GameState` (`GameEngineData` from the generated API) for the game currently being played, plus at-bat result/processing UI state. It also owns the SignalR connection lifecycle:
  - Connects to `${VITE_API_BASE_URL}/hubs/game` once on mount (regardless of sign-in state), joins the SignalR group for the current `game.gameId` whenever it changes (and rejoins `onreconnected`).
  - Listens for push events (typed in `src/broadcasting/signalrEvents.ts` / `snapshots.ts`): `GameStateUpdated` (replaces `game`, and derives `isAtBatProcessing` from `stateType === "ResolveAtBat"`) and `AtBatResolved` (sets `lastAtBatResult`, clears processing).
  - So game state updates arrive from two sources: the initial REST response when starting/joining a game (`GameEngineService.postGameEngineNew` / `postGameEngineJoin`), and subsequent SignalR pushes as other players / the engine act.

**Session cookie in dev.** The app calls the API cross-origin, so requests send credentials (`init.ts`) and the backend's CORS policy allows credentials for `http://localhost:5173` and the LAN address. Open the app on the same host as `VITE_API_BASE_URL` (both `localhost`, or both the LAN IP) and keep both on the same scheme, or the browser treats the cookie as cross-site and won't send it. Over the LAN, Google sign-in generally won't work (Google rejects private-IP redirects); email codes do.

**Player input** is submitted via `GameEngineService.postGameEngineEvent` with an `eventType` of `"batter-input"` or `"pitcher-input"`, carrying a `PitchInput` (`src/types/pitch.ts`: pitch type + horizontal/vertical location) — the result comes back asynchronously through the `AtBatResolved`/`GameStateUpdated` SignalR events above, not the POST response.

**Generated API client** (`src/api/generated`, openapi-typescript-codegen `fetch` client): `index.ts` re-exports everything, so import models/services from `../api/generated` rather than reaching into subpaths. `src/api/generated/init.ts` is hand-written and survives regeneration: it sets `OpenAPI.BASE` from `VITE_API_BASE_URL` and turns on `WITH_CREDENTIALS` so the session cookie is sent, and is imported once for its side effect in `main.tsx`. Services: `AuthService` (sign-in/out, `me`), `AccountService` (`PUT /account/profile` to change the display name; not used in the UI yet), `GameEngineService` (start/join/event) and `TeamsService` (team listings for setup).

**Local types vs. generated types.** `src/types` and `src/models` hold hand-written types for things the API doesn't shape the way the UI needs (e.g. `PitchInput`/`PitchLocation` in `types/pitch.ts`, `PlayerLine`/`AtBatResultType` in `types/game.ts`, `TeamSetup` in `models/TeamSetup.ts`). Generated equivalents from `src/api/generated/models` are used directly elsewhere (e.g. `Batter`, `GameTeam`, `GameEngineStateType`, `CurrentUserResponse`). When both exist for a concept, check which one a given component already imports before adding a new type.

**Path alias:** `@` → `src` (configured in `vite.config.js`), used inconsistently — most imports are relative.
