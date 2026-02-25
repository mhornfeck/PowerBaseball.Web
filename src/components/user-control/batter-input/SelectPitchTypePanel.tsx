import { PitchType } from "../../../types/pitch";
import Button from "../../button/Button";
import "./BatterInputControl.css";

interface SelectPitchTypePanelProps {
  onSelect: (pitchType: PitchType) => void;
}

export default function SelectPitchTypePanel({
  onSelect,
}: SelectPitchTypePanelProps) {
  return (
    <div className="pitch-overlay">
      <div className="pitch-panel">
        <h3>Select Pitch Type</h3>
        <div className="button-container">
          <Button variant="primary" onClick={() => onSelect("Fastball")}>
            Fastball
          </Button>

          <Button variant="primary" onClick={() => onSelect("Curveball")}>
            Curveball
          </Button>

          <Button variant="primary" onClick={() => onSelect("Slider")}>
            Slider
          </Button>
        </div>
      </div>
    </div>
  );
}
