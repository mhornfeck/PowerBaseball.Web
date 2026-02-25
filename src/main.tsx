import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "@/api/generated/init";
import { PlayerProvider } from "./context/PlayerContext";
import { GameProvider } from "./context/GameContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <PlayerProvider>
    <GameProvider>
      <App />
    </GameProvider>
  </PlayerProvider>,
);
