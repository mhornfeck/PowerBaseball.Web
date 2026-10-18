import { Batter, InningHalf, SideChangeOccurredSnapshot } from "../../api/generated";
import WaitForPlayersControl from "../user-control/WaitForPlayersControl";
import "./SideChangeSummary.css";

interface SideChangeSummaryProps {
  snapshot: SideChangeOccurredSnapshot;
}

export function SideChangeSummary({ snapshot }: SideChangeSummaryProps) {
  const { inningNumber, inningHalf, summary } =
    snapshot;
  // The backend's OpenAPI spec doesn't type this field beyond `any[]` yet -
  // it's actually Batter[].
  const dueUp = snapshot.dueUp as Batter[];

  // inningHalf is the half that just ended: Top ending means we're at the
  // middle of the inning, Bottom ending means the inning is fully over.
  const halfLabel = inningHalf === InningHalf.TOP ? "Middle" : "End";

  return (
    <div className="side-change-summary panel">
      <div className="side-change-half">
        {halfLabel} {inningNumber}
      </div>

      <div className="side-change-line-score">
        <div className="side-change-stats-line">
          <span className="stat-value">{summary.runs}</span> Run
          {summary.runs === 1 ? "" : "s"},{" "}
          <span className="stat-value">{summary.hits}</span> Hit
          {summary.hits === 1 ? "" : "s"},{" "}
          <span className="stat-value">{summary.leftOnBase}</span> LOB
        </div>
      </div>

      <div className="side-change-due-up">
        <div className="side-change-due-up-label">
          DUE UP
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
