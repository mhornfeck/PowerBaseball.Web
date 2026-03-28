import { useState } from "react";
import { Team, TeamListingModel } from "../../api/generated";
import "./TeamSelection.css";
import Button from "../button/Button";

interface TeamSelectionProps {
  teams: TeamListingModel[];
  onSubmit: (home: TeamListingModel, away: TeamListingModel) => void;
  onBack: () => void;
}

export default function TeamSelection({
  teams,
  onSubmit,
  onBack,
}: TeamSelectionProps) {
  const [homeTeam, setHomeTeam] = useState<TeamListingModel | undefined>(
    undefined,
  );

  const [awayTeam, setAwayTeam] = useState<TeamListingModel | undefined>(
    undefined,
  );

  const onClickSubmit = () => {
    if (homeTeam && awayTeam) {
      onSubmit(homeTeam, awayTeam);
    }
  };

  return (
    <div className="team-selection">
      {teams.length === 0 ? (
        <p>No teams available</p>
      ) : (
        <>
          <div className="team-selectors">
            <div className="team-selector">
              <h3>Home Team</h3>
              {homeTeam && (
                <div className="selected-team">
                  {homeTeam.city} {homeTeam.name}
                </div>
              )}
              {!homeTeam && (
                <select
                  onChange={(e) => {
                    const selected = teams.find((t) => t.id === e.target.value);
                    setHomeTeam(selected);
                  }}
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.city} {team.name} ({team.overallRating})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="team-selector">
              <h3>Away Team</h3>
              {awayTeam && (
                <div className="selected-team">
                  {awayTeam.city} {awayTeam.name}
                </div>
              )}
              {!awayTeam && (
                <select
                  onChange={(e) => {
                    const selected = teams.find((t) => t.id === e.target.value);
                    setAwayTeam(selected);
                  }}
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.city} {team.name} ({team.overallRating})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="buttons-container">
            <Button variant="transparent" onClick={onBack}>
              Back
            </Button>
            <Button
              variant="primary"
              disabled={!homeTeam || !awayTeam}
              onClick={onClickSubmit}
            >
              OK
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
