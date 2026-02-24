import { TeamListingModel } from "../../api/generated";
import "./TeamSelection.css";

interface TeamSelectionProps {
  teams: TeamListingModel[];
  selectedTeamId?: string;
  onChange: (team: TeamListingModel) => void;
};

export default function TeamSelection({
  teams,
  selectedTeamId,
  onChange,
}: TeamSelectionProps) {
  return (
    <div className="team-selection">
      {teams.length === 0 ? (
        <p>No teams available</p>
      ) : (
        <select
          value={selectedTeamId ?? ""}
          onChange={(e) => {
            const selected = teams.find(
              (t) => t.id === e.target.value
            );
            if (selected) onChange(selected);
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
  );
}