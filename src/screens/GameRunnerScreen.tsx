// /screens/GameRunnerScreen.tsx
import "./GameRunnerScreen.css";
import Button from "../components/button/Button";
import Scoreboard from "../components/scoreboard/Scoreboard";

type GameRunnerScreenProps = {
  onBack: () => void;
};

export default function GameRunnerScreen({ onBack }: GameRunnerScreenProps) {
  return (
    <div className="game-runner-container">
      <Scoreboard
        awayTeam="Sluggers"
        homeTeam="Mashers"
        awayScores={[1, 0, 2, 0, 1]}
        homeScores={[0, 1, 0, 2, 0]}
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
