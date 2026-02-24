// /components/Scoreboard.tsx
import "./Scoreboard.css";

type ScoreboardProps = {
  awayTeam: string;
  homeTeam: string;
  awayScores: number[]; // length = 5
  homeScores: number[]; // length = 5
};

export default function Scoreboard({
  awayTeam,
  homeTeam,
  awayScores,
  homeScores,
}: ScoreboardProps) {
  const totalRuns = (scores: number[]) => scores.reduce((a, b) => a + b, 0);
  const totalHits = (scores: number[]) => scores.reduce((a, b) => a + b, 0); // simple, hits = runs for now

  return (
    // Scoreboard.tsx (relevant portion)

<div className="scoreboard-container">
  <div className="scoreboard-inner">
    
    {/* Inning table */}
    <table className="innings-table">
      <thead>
        <tr>
          <th></th>
          {[1, 2, 3, 4, 5].map((inning) => (
            <th key={inning}>{inning}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="team-name">{awayTeam}</td>
          {awayScores.map((s, i) => (
            <td key={i}>{s}</td>
          ))}
        </tr>
        <tr>
          <td className="team-name">{homeTeam}</td>
          {homeScores.map((s, i) => (
            <td key={i}>{s}</td>
          ))}
        </tr>
      </tbody>
    </table>

    {/* Totals table */}
    <table className="totals-table">
      <thead>
        <tr>
          <th>R</th>
          <th>H</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{totalRuns(awayScores)}</td>
          <td>{totalHits(awayScores)}</td>
        </tr>
        <tr>
          <td>{totalRuns(homeScores)}</td>
          <td>{totalHits(homeScores)}</td>
        </tr>
      </tbody>
    </table>

  </div>
</div>
  );
}