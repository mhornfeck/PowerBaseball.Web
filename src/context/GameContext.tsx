import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import type { GameEngineData } from "../api/generated/models/GameEngineData";
import type { GameEngineStateType } from "../api/generated/models/GameEngineStateType";
import type { SideChangeOccurredSnapshot } from "../api/generated";
import {
  AtBatResolvedSnapshot,
  AtBatResult,
  GameStateUpdatedSnapshot,
} from "../broadcasting/snapshots";
import {
  mapBaseRunners,
  mapFinalScore,
  mapLineups,
  mapRosters,
  mapScoreboard,
  mapTurnState,
} from "../mappers/game.mapper";
import type {
  BaseRunners,
  FinalScoreState,
  Lineups,
  Rosters,
  ScoreboardState,
  TurnState,
} from "../types/game";
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
  lastSideChange: SideChangeOccurredSnapshot | null;
  runners: BaseRunners;
  scoreboard: ScoreboardState;
  turnState: TurnState;
  stateType: GameEngineStateType | null;
  lineups: Lineups;
  finalScore: FinalScoreState;
  rosters: Rosters;
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

  const runners = useMemo(() => mapBaseRunners(game), [game]);
  const scoreboard = useMemo(() => mapScoreboard(game), [game]);
  const turnState = useMemo(() => mapTurnState(game), [game]);
  const stateType = game?.currentStateData.stateType ?? null;
  const lastSideChange = game?.lastSideChange ?? null;
  const lineups = useMemo(() => mapLineups(game), [game]);
  const finalScore = useMemo(() => mapFinalScore(game), [game]);
  const rosters = useMemo(() => mapRosters(game), [game]);

  const connectionRef = useRef<HubConnection | null>(null);
  const gameIdRef = useRef<string | null>(null);

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
      if (gameIdRef.current) {
        connection.invoke("JoinGame", gameIdRef.current);
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    gameIdRef.current = game?.gameId ?? null;

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
        lastSideChange,
        runners,
        scoreboard,
        turnState,
        stateType,
        lineups,
        finalScore,
        rosters,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally colocated with its provider
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }
  return context;
}
