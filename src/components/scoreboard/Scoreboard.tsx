// /components/Scoreboard.tsx
import { useGame } from "../../context/GameContext";
import "./Scoreboard.css";

export default function Scoreboard() {
  const { game } = useGame();
  const currentInning = game?.game.inning;
  const awayTeam = game?.game.awayTeam;
  const homeTeam = game?.game.homeTeam;

  const max =
    currentInning?.inningNumber! <= 5 ? 5 : currentInning?.inningNumber!;
  const innings = Array.from({ length: max }, (_, i) => i + 1);

  // Helper function
  function formatInningDisplay() {
    if (!game?.game) return "";

    const { isFinal, inning } = game.game;
    if (isFinal) {
      // If extra innings, show FINAL/inningNumber
      return inning?.inningNumber! > 5
        ? `FINAL/${inning?.inningNumber}`
        : "FINAL";
    }

    // Not final: TOP or BOT + inning number
    const half = inning?.inningHalf;
    const num = inning?.inningNumber;
    if (half === 0) return `TOP ${num}`;
    if (half === 1) return `BOT ${num}`;

    return ""; // fallback if data is weird
  }

  return (
    // Scoreboard.tsx (relevant portion)

    <div className="scoreboard-container">
      <div className="scoreboard-inner">
        {/* Inning table */}
        <table className="innings-table">
          <thead>
            <tr>
              <th></th>
              {innings.map((inning) => (
                <th key={inning}>{inning}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="team-name">{awayTeam?.city}</td>
              {awayTeam?.boxScore?.map((s, i) => (
                <td
                  key={i}
                  className={
                    currentInning?.inningHalf === 0 &&
                    currentInning?.inningNumber === i + 1
                      ? "active"
                      : ""
                  }
                >
                  {s}
                </td>
              ))}
            </tr>
            <tr>
              <td className="team-name">{homeTeam?.city}</td>
              {homeTeam?.boxScore?.map((s, i) => (
                <td
                  key={i}
                  className={
                    currentInning?.inningHalf === 1 &&
                    currentInning?.inningNumber === i + 1
                      ? "active"
                      : ""
                  }
                >
                  {s}
                </td>
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
          {formatInningDisplay()}
        </div>

        <div className="outs-display">
          OUT
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`out-circle ${
                (game?.game.outs ?? 0) > i ? "active" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
