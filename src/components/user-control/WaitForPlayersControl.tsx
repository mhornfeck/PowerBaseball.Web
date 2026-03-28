import { useState } from "react";
import {
  GameEngineService,
  GameEventRequestPlayerReadyEventRequest,
} from "../../api/generated";
import { useGame } from "../../context/GameContext";
import { usePlayer } from "../../context/PlayerContext";
import "./WaitForPlayersControl.css";

export default function WaitForPlayersControl() {
  const { game } = useGame();
  const { playerId } = usePlayer();

  const [isReady, setIsReady] = useState<boolean>(false);

  const handleReady = async () => {
    if (!game) {
      return;
    }

    game.game.battingTeam?.id;

    const request: GameEventRequestPlayerReadyEventRequest = {
      eventType: "player-ready",
      gameId: game.gameId,
      playerId: playerId,
    };

    await GameEngineService.postGameEngineEvent(request);

    setIsReady(true);
  };

  return (
    <div className="wait-for-players-control panel">
      {!isReady && (
        <button className="btn btn-primary" onClick={handleReady}>
          Ready
        </button>
      )}
      {isReady && (
        <div className="wait-for-players-text">
          Waiting for other players...
        </div>
      )}
    </div>
  );
}
