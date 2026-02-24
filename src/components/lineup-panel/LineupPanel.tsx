import "./LineupPanel.css";

type PlayerLine = {
  jerseyNumber: number;
  name: string;
  hits: number;
  atBats: number;
};

type LineupPanelProps = {
  teamName: string;
  players: PlayerLine[];
  currentBatterId?: number;
};

export default function LineupPanel({
  teamName,
  players,
  currentBatterId,
}: LineupPanelProps) {
  return (
    <div className="lineup-panel">
      <h2 className="lineup-title">{teamName}</h2>

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