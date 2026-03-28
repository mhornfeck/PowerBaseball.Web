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
  const { game } = useGame();
  const { playerId } = usePlayer();

  if (!game) return { isActive: false };

  const battingTeamId = game.game.battingTeam?.id;

  const teams = [game.home, game.away];

  const battingTeam = teams.find((t) => t.id === battingTeamId);
  const pitchingTeam = teams.find((t) => t.id !== battingTeamId);

  const targetTeam = expectedRole === "batting" ? battingTeam : pitchingTeam;

  const activePlayer = targetTeam?.activePlayer;

  return {
    isActive: activePlayer?.id === playerId,
    activePlayerId: activePlayer?.id,
    activePlayerName: activePlayer?.username,
  };
}
