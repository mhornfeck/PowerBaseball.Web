import { createContext, useContext, useState, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import type { GameEngineData } from "../api/generated/models/GameEngineData";
import { PlayerLine, AtBatResultType } from "../types/game";

export type GameState = GameEngineData;
export type AtBatResult = {
  resultType: AtBatResultType;
  batter: PlayerLine;
};

type GameContextType = {
  game: GameState | null;
  setGame: (game: GameState) => void;
  clearGame: () => void;
  lastAtBatResult: AtBatResult | null;
  setLastAtBatResult: (result: AtBatResult) => void;
  clearLastAtBatResult: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameState | null>(null);
  const [lastAtBatResult, setLastAtBatResult] = useState<AtBatResult | null>(
    null,
  );

  const clearGame = () => setGame(null);
  const clearLastAtBatResult = () => setLastAtBatResult(null);

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

          setLastAtBatResult(snapshot.atBatResult);
          setTimeout(() => {
            clearLastAtBatResult();
          }, 3000);
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
    <GameContext.Provider
      value={{
        game,
        setGame,
        clearGame,
        lastAtBatResult,
        setLastAtBatResult,
        clearLastAtBatResult,
      }}
    >
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
