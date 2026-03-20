import "./FinalScore.css";
import Button from "../button/Button";
import { Fireworks } from "../fireworks/Fireworks";

export interface FinalScoreProps {
  winningTeamName: string;
  winningScore: number;
  losingScore: number;
  onDone: () => void;
}

export default function FinalScore({
  winningTeamName,
  winningScore,
  losingScore,
  onDone,
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
        <Button onClick={onDone}>Done</Button>
      </div>
      <Fireworks />
    </div>
  );
}
