import { AtBatResult } from "../../context/GameContext";
import { Fireworks } from "../fireworks/Fireworks";
import "./AtBatResultOverlay.css";

interface AtBatResultOverlayProps {
  result: AtBatResult;
}

export function AtBatResultOverlay({ result }: AtBatResultOverlayProps) {
  return (
    <div className={"atbat-result-overlay " + result.resultType.toLowerCase()}>
      <div className={"atbat-result-text blink " + result.resultType.toLowerCase()}>{result.resultType}</div>
      <div className="atbat-result-batter">
        #{result.batter.jerseyNumber} {result.batter.name}
      </div>
      {result.resultType === "Homerun" && <Fireworks />}
    </div>
  );
}
