// components/WaitForPlayersControl.tsx
import { GameEngineService, GameEventRequestPlayerReadyEventRequest } from "../../api/generated"
import { useGame } from "../../context/GameContext"
import { usePlayer } from "../../context/PlayerContext"

export default function WaitForPlayersControl() {
  const { game } = useGame();
  const { playerId } = usePlayer();

  const handleReady = async () => {
    if (!game) {
        return;
    }

    const request: GameEventRequestPlayerReadyEventRequest = {
        eventType: "player-ready",
        gameId: game.gameId,
        playerId: playerId
    };

    await GameEngineService.postGameEngineEvent(request);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 400 }}>
      <button className="btn btn-primary" onClick={handleReady}>
        Ready
      </button>
    </div>
  );
}