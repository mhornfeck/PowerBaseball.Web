import { useGame } from "../../context/GameContext";
import { PlayerLine } from "../../types/game";
import "./LineupPanel.css";

type LineupPanelProps = {
  teamName: string;
  players: PlayerLine[];
  currentBatterId?: number;
  onPlayerClick: (player: PlayerLine | null) => void;
};

export default function LineupPanel({
  teamName,
  players,
  currentBatterId,
  onPlayerClick
}: LineupPanelProps) {
  
  const { game } = useGame();
  const isTeamAtBat = game?.game.battingTeam?.city === teamName;
  const activeClassName = (isTeamAtBat ? "active" : "inactive");

  return (
    <div className={"lineup-panel " + activeClassName}>
      <h2 className={"lineup-title " + activeClassName}>{teamName}</h2>
      <table className="lineup-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>H-AB</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const isCurrent = player.jerseyNumber === currentBatterId;

            return (
              <tr
                key={player.jerseyNumber}
                className={isCurrent ? "current-batter" : ""}
                onClick={() => onPlayerClick(player)}
              >
                <td>{player.jerseyNumber}</td>
                <td>{player.name}</td>
                <td>
                  {player.hits}-{player.atBats}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}