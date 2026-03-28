import { PlayerLine } from "../../types/game";
import "./BatterStats.css";

type BatterStatsProps = {
  player: PlayerLine;
  onClose: () => void;
};

export default function BatterStats({ player, onClose }: BatterStatsProps) {
  return (
    <div className="batter-stats-overlay" onClick={onClose}>
      <div className="batter-stats" onClick={(e) => e.stopPropagation()}>
        <h3>{player.name}</h3>
        <p>Jersey: {player.jerseyNumber}</p>
        <p>Hits: {player.hits}</p>
        <p>At-Bats: {player.atBats}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}