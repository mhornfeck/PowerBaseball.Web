import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type PlayerContextType = {
  playerId: string;
  playerHandle: string;
  setPlayerHandle: (handle: string) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function generatePlayerId() {
  return uuidv4();
}

function loadOrCreatePlayerId() {
  const stored = localStorage.getItem("playerId");
  if (stored) return stored;

  const newId = generatePlayerId();
  localStorage.setItem("playerId", newId);
  return newId;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [playerId] = useState<string>(loadOrCreatePlayerId);
  const [playerHandle, setPlayerHandle] = useState<string>("");

  return (
    <PlayerContext.Provider value={{ playerId, playerHandle, setPlayerHandle }}>
      {children}
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is intentionally colocated with its provider
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return context;
}
