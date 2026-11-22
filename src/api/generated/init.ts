import { OpenAPI } from "./core/OpenAPI";

OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// Auth is a cookie session, so every request must carry the cookie. Same-origin
// requests send it anyway; this also covers calling the API cross-origin in dev.
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = "include";
