import { useGame } from "../context/GameContext";
import { usePlayer } from "../context/PlayerContext";

type UseCurrentPlayerResult = {
  isActive: boolean;
  activePlayerId?: string;
  activePlayerName?: string;
};

export function useCurrentPlayer(
  expectedRole: "batting" | "pitching",
): UseCurrentPlayerResult {
  const { turnState } = useGame();
  const { playerId } = usePlayer();

  const activePlayer =
    expectedRole === "batting"
      ? turnState.battingTeamActivePlayer
      : turnState.pitchingTeamActivePlayer;

  return {
    isActive: activePlayer?.id === playerId,
    activePlayerId: activePlayer?.id,
    activePlayerName: activePlayer?.name,
  };
}
