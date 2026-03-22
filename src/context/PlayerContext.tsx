// PlayerContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type PlayerContextType = {
  playerId: string;
  playerHandle: string;
  setPlayerHandle: (handle: string) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function generatePlayerId() {
  return crypto.randomUUID();
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [playerId, setPlayerId] = useState<string>("");
  const [playerHandle, setPlayerHandle] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("playerId");

    if (stored) {
      setPlayerId(stored);
    } else {
      const newId = generatePlayerId();
      localStorage.setItem("playerId", newId);
      setPlayerId(newId);
    }
  }, []);

  return (
    <PlayerContext.Provider value={{ playerId, playerHandle, setPlayerHandle }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return context;
}
