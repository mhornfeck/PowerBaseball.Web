import "./FinalScore.css";
import Button from "../button/Button";
import { Fireworks } from "../fireworks/Fireworks";

export interface FinalScoreProps {
  winningTeamName: string;
  winningScore: number;
  losingScore: number;
}

export default function FinalScore({
  winningTeamName,
  winningScore,
  losingScore,
}: FinalScoreProps) {
  return (
    <div className="final-score">
      <div className="text-container">
        <div className="winning-team-name">{winningTeamName}</div>
        <div className="wins-label">WINS</div>
        <div className="score-display">
          {winningScore} - {losingScore}
        </div>
      </div>
      <div className="buttons-container">
        <Button>Done</Button>
      </div>
      <Fireworks />
    </div>
  );
}
