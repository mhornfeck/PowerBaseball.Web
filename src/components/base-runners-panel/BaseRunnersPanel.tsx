import { useGame } from "../../context/GameContext";
import { BatterInfo } from "../../types/game";
import "./BaseRunnersPanel.css";

export function BaseRunnersPanel() {
  const { runners } = useGame();

  const renderBase = (runner: BatterInfo | null) => (
    <div className={`base ${runner ? "occupied" : ""}`}>
      <span className="jersey-number">{runner ? runner.jerseyNumber : ""}</span>
    </div>
  );

  return (
    <div className="bases-panel">
      <div className="diamond">
        <div className="second">{renderBase(runners.second)}</div>
        <div className="third">{renderBase(runners.third)}</div>
        <div className="first">{renderBase(runners.first)}</div>
      </div>
    </div>
  );
}
