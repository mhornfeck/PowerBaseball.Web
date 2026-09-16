import { InningHalf } from "../../api/generated/models/InningHalf";
import { SideChangeOccurredSnapshot } from "../../broadcasting/snapshots";
import WaitForPlayersControl from "../user-control/WaitForPlayersControl";
import "./SideChangeSummary.css";

interface SideChangeSummaryProps {
  snapshot: SideChangeOccurredSnapshot;
}

export function SideChangeSummary({ snapshot }: SideChangeSummaryProps) {
  const { inningNumber, inningHalf, battingTeam, pitchingTeam, summary, dueUp } =
    snapshot;

  // inningHalf is the half that just ended: Top ending means we're at the
  // middle of the inning, Bottom ending means the inning is fully over.
  const halfLabel = inningHalf === InningHalf.TOP ? "Middle" : "End";

  return (
    <div className="side-change-summary panel">
      <div className="side-change-half">
        {halfLabel} {inningNumber}
      </div>

      <div className="side-change-line-score">
        <div className="side-change-team-name">{battingTeam.name}</div>
        <table className="side-change-totals-table">
          <thead>
            <tr>
              <th>R</th>
              <th>H</th>
              <th>LOB</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{summary.runs}</td>
              <td>{summary.hits}</td>
              <td>{summary.leftOnBase}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="side-change-due-up">
        <div className="side-change-due-up-label">
          {pitchingTeam.name} due up
        </div>
        <ul>
          {dueUp.map((batter) => (
            <li key={batter.jerseyNumber}>
              #{batter.jerseyNumber} {batter.name} ({batter.statistics?.hits ?? 0}-
              {batter.statistics?.atBats ?? 0})
            </li>
          ))}
        </ul>
      </div>

      <WaitForPlayersControl embedded />
    </div>
  );
}
