import { useState } from "react";
import {
  GameEngineService,
  GameEventRequestPlayerReadyEventRequest,
} from "../../api/generated";
import { useGame } from "../../context/GameContext";
import { usePlayer } from "../../context/PlayerContext";
import "./WaitForPlayersControl.css";

interface WaitForPlayersControlProps {
  // When rendered inside another panel (e.g. the inning-end summary),
  // skip the standalone panel chrome so it doesn't nest inside another one.
  embedded?: boolean;
}

export default function WaitForPlayersControl({
  embedded = false,
}: WaitForPlayersControlProps) {
  const { game } = useGame();
  const { playerId } = usePlayer();

  const [isReady, setIsReady] = useState<boolean>(false);

  const handleReady = async () => {
    if (!game) {
      return;
    }

    const request: GameEventRequestPlayerReadyEventRequest = {
      eventType: "player-ready",
      gameId: game.gameId,
      playerId: playerId,
    };

    await GameEngineService.postGameEngineEvent(request);

    setIsReady(true);
  };

  return (
    <div
      className={
        "wait-for-players-control" + (embedded ? " embedded" : " panel")
      }
    >
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
