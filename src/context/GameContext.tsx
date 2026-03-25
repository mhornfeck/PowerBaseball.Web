import { createContext, useContext, useState, useEffect, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import type { GameEngineData } from "../api/generated/models/GameEngineData";
import {
  AtBatResolvedSnapshot,
  AtBatResult,
  GameStateUpdatedSnapshot,
} from "../broadcasting/snapshots";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export type GameState = GameEngineData;

type GameContextType = {
  game: GameState | null;
  setGame: (game: GameState) => void;
  clearGame: () => void;
  lastAtBatResult: AtBatResult | null;
  isAtBatProcessing: boolean;
  setLastAtBatResult: (result: AtBatResult) => void;
  clearLastAtBatResult: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameState | null>(null);
  const [lastAtBatResult, setLastAtBatResult] = useState<AtBatResult | null>(
    null,
  );
  const [isAtBatProcessing, setIsAtBatProcessing] = useState<boolean>(false);

  const clearGame = () => setGame(null);
  const clearLastAtBatResult = () => setLastAtBatResult(null);

  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (connectionRef.current) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE}/hubs/game`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected 🔥");

        connection.on("AtBatResolved", (snapshot: AtBatResolvedSnapshot) => {
          console.log("AtBatResolved received:", snapshot);

          setLastAtBatResult(snapshot.result);
          setIsAtBatProcessing(false);
        });

        connection.on(
          "GameStateUpdated",
          (snapshot: GameStateUpdatedSnapshot) => {
            console.log("GameStateUpdated received:", snapshot);

            setIsAtBatProcessing(snapshot.stateType === "ResolveAtBat");

            clearLastAtBatResult();

            setGame(snapshot.data);
          },
        );
      })
      .catch((err) => console.error("SignalR connection error:", err));

    connection.onreconnected(() => {
      if (game?.gameId) {
        connection.invoke("JoinGame", game.gameId);
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    const connection = connectionRef.current;
    if (!connection || !game?.gameId) return;

    connection
      .invoke("JoinGame", game.gameId)
      .then(() => console.log(`Joined game ${game.gameId}`))
      .catch((err) => console.error("JoinGame failed:", err));
  }, [game?.gameId]);

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        clearGame,
        lastAtBatResult,
        isAtBatProcessing,
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
