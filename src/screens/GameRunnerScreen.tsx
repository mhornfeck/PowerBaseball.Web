// /screens/GameRunnerScreen.tsx
import "./GameRunnerScreen.css";
import Button from "../components/button/Button";
import Scoreboard from "../components/scoreboard/Scoreboard";
import { useGame } from "../context/GameContext";

type GameRunnerScreenProps = {
  onBack: () => void;
};

export default function GameRunnerScreen({ onBack }: GameRunnerScreenProps) {
  const { game } = useGame();

    if (!game) {
        return <div>Loading game...</div>;
    }

  return (
    <div className="game-runner-container">
      <Scoreboard
        awayTeam={game.away.team.city!}
        homeTeam={game.home.team.city!}
        awayScores={[0, 0, 0, 0, 0]}
        homeScores={[0, 0, 0, 0, 0]}
      />

      {/* Example Back button */}
      <div className="menu">
        <Button variant="primary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
