// /screens/GameRunnerScreen.tsx
import "./GameRunnerScreen.css";
import Button from "../components/button/Button";

type GameRunnerScreenProps = {
  onBack: () => void;
};

export default function GameRunnerScreen({ onBack }: GameRunnerScreenProps) {
  return (
    <div className="game-runner-container">
      <img src="/images/baseball-field.png" alt="Baseball Field" className="field-image" />
      
      {/* Overlay text / debug */}
      <div className="overlay-text">RUN IT BACK</div>

      {/* Example Back button */}
      <div className="menu">
        <Button variant="primary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}