import { createContext, useContext, useState, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import type { GameEngineData } from "../api/generated/models/GameEngineData";

export type GameState = GameEngineData;

type GameContextType = {
  game: GameState | null;
  setGame: (game: GameState) => void;
  clearGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameState | null>(null);

  const clearGame = () => setGame(null);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (connectionRef.current) return;

    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7181/hubs/game") // adjust port
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected 🔥");

        connection.on("AtBatResolved", (snapshot) => {
          console.log("AtBatResolved received:", snapshot);

          setGame((prev) => ({
            ...prev,
            ...snapshot.gameState, // or smarter merge depending on structure
          }));
        });

        connection.on("GameStateUpdated", (snapshot) => {
          console.log("GameStateUpdated received:", snapshot);

          setGame((prev) => ({
            ...prev,
            ...snapshot.gameState,
          }));
        });

      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <GameContext.Provider value={{ game, setGame, clearGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }
  return context;
}
