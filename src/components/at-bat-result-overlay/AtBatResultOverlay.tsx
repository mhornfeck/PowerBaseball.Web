import { AtBatResult } from "../../context/GameContext";
import "./AtBatResultOverlay.css";

interface AtBatResultOverlayProps {
  result: AtBatResult
}

export function AtBatResultOverlay({
  result
}: AtBatResultOverlayProps) {
  return (
    <div className="atbat-result-overlay">
      <div className="atbat-result-text blink">
        {result.resultType}
      </div>
      <div className="atbat-result-batter">
        #{result.batter.jerseyNumber} {result.batter.name}
      </div>
      { result.resultType === 'Homerun' &&
            <div className="fireworks-container">
                <div className="firework"></div>
                <div className="firework"></div>
            </div>
      }
    </div>
  );
}