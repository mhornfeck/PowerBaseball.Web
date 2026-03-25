import { OpenAPI } from "./core/OpenAPI";

OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL ?? "";
