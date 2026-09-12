// /components/Scoreboard.tsx
import { useGame } from "../../context/GameContext";
import "./Scoreboard.css";

export default function Scoreboard() {
  const { scoreboard } = useGame();
  const { inning, isFinal, outs, away, home } = scoreboard;

  const max = Math.max(inning?.number ?? 0, 5);
  const innings = Array.from({ length: max }, (_, i) => i + 1);

  function formatInningDisplay() {
    if (!inning) return "";

    if (isFinal) {
      // If extra innings, show FINAL/inningNumber
      return inning.number > 5 ? `FINAL/${inning.number}` : "FINAL";
    }

    // Not final: TOP or BOT + inning number
    if (inning.half === "Top") return `TOP ${inning.number}`;
    if (inning.half === "Bottom") return `BOT ${inning.number}`;

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
              {innings.map((n) => (
                <th key={n}>{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="team-name">{away.city}</td>
              {away.boxScore.map((s, i) => (
                <td
                  key={i}
                  className={
                    inning?.half === "Top" && inning?.number === i + 1
                      ? "active"
                      : ""
                  }
                >
                  {s}
                </td>
              ))}
            </tr>
            <tr>
              <td className="team-name">{home.city}</td>
              {home.boxScore.map((s, i) => (
                <td
                  key={i}
                  className={
                    inning?.half === "Bottom" && inning?.number === i + 1
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
              <td>{away.score}</td>
              <td>{away.hits}</td>
            </tr>
            <tr>
              <td>{home.score}</td>
              <td>{home.hits}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 🔥 NEW: Inning + Outs Row */}
      <div className="inning-status">
        <div className="inning-display">{formatInningDisplay()}</div>

        <div className="outs-display">
          OUT
          {[0, 1].map((i) => (
            <div key={i} className={`out-circle ${outs > i ? "active" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
