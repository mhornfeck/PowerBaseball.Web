import { Batter2 } from "../../api/generated";
import { useGame } from "../../context/GameContext";
import "./BaseRunnersPanel.css";

export function BaseRunnersPanel() {
  const { game } = useGame();

  const renderBase = (runner?: Batter2) => (
    <div className={`base ${runner ? "occupied" : ""}`}>
      <span className="jersey-number">{runner ? runner.jerseyNumber : ""}</span>
    </div>
  );

  return (
    <div className="bases-panel">
      <div className="diamond">
        <div className="second">{renderBase(game?.game.secondBase)}</div>
        <div className="third">{renderBase(game?.game.thirdBase)}</div>
        <div className="first">{renderBase(game?.game.firstBase)}</div>
      </div>
    </div>
  );
}
