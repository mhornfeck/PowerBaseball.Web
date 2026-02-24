import { createContext, useContext, useState } from "react";
import type { GameEngineData } from '../api/generated/models/GameEngineData';

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