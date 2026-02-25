// /components/Scoreboard.tsx
import { useGame } from "../../context/GameContext";
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
  const { game } = useGame();
  const currentInning = game?.game.inning;

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
                <td key={i} className={(currentInning?.inningHalf === 0 && currentInning?.inningNumber === i + 1) ? "active" : ""}> </td>
              ))}
            </tr>
            <tr>
              <td className="team-name">{homeTeam}</td>
              {homeScores.map((s, i) => (
                <td key={i} className={(currentInning?.inningHalf === 1 && currentInning?.inningNumber === i + 1) ? "active" : ""}> </td>
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
              <td>{game?.away.team.score}</td>
              <td>{game?.away.team.statistics?.hits}</td>
            </tr>
            <tr>
              <td>{game?.home.team.score}</td>
              <td>{game?.home.team.statistics?.hits}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 🔥 NEW: Inning + Outs Row */}
      <div className="inning-status">
        <div className="inning-display">
          {game?.game.inning?.inningHalf === 0 ? "TOP" : "BOT"}{" "}
          {game?.game.inning?.inningNumber}
        </div>

        <div className="outs-display">
          OUT
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`out-circle ${
                ((game?.game.outs ?? 0) > i) ? "active" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
