import { useState, useEffect } from "react";
import { TeamsService, TeamListingModel } from "../api/generated";
import TeamSelection from "../components/team-selection/TeamSelection";
import Button from "../components/button/Button";
import { TeamSetup } from "../models/TeamSetup";
import "./GameSetupScreen.css";

interface GameSetupScreenProps {
  onBack: () => void;
  onDone: (teamSetup: TeamSetup) => void;
}

export default function GameSetupScreen({
  onBack,
  onDone,
}: GameSetupScreenProps) {
  const [teams, setTeams] = useState<TeamListingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTeam, setCurrentTeam] = useState("home");
  const [homeTeam, setHomeTeam] = useState<TeamListingModel | null>(null);
  const [awayTeam, setAwayTeam] = useState<TeamListingModel | null>(null);

  const onSetHomeTeam = (team: TeamListingModel) => {
    setHomeTeam(team);
    setCurrentTeam("away");
  };

  const onSetAwayTeam = (team: TeamListingModel) => {
    setAwayTeam(team);
    if (homeTeam && team) {
      setCurrentTeam("done");
    }
  };

  const onClickBack = () => {
    if (currentTeam === "done") {
      setCurrentTeam("away");
    } else if (currentTeam === "away") {
      setCurrentTeam("home");
    } else {
      onBack();
    }
  };

  const onClickDone = () => {
    if (!homeTeam || !awayTeam) {
      return;
    }

    const teamSetup: TeamSetup = {
      homeTeam: {
        teamId: homeTeam.id,
      },
      awayTeam: {
        teamId: awayTeam.id,
      },
    };

    onDone(teamSetup);
  };

  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await TeamsService.getTeams();
        setTeams(data);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  if (loading) return <div>Loading teams...</div>;

  return (
    <div>
      <h1>Game Setup</h1>

      <div className="teams-container">
        <div className="teams-container--group">
          <div className="team-label">Home:</div>
          <div className="team-value">{homeTeam?.city ?? ""}</div>
        </div>
        <div className="teams-container--group">
          <div className="team-label">Away:</div>
          <div className="team-value">{awayTeam?.city ?? ""}</div>
        </div>
      </div>

      {currentTeam === "home" && (
        <>
          <h2>Home</h2>
          <TeamSelection
            teams={teams}
            selectedTeamId={homeTeam?.id}
            onChange={onSetHomeTeam}
          />
        </>
      )}

      {currentTeam === "away" && (
        <>
          <h2>Away</h2>
          <TeamSelection
            teams={teams}
            selectedTeamId={awayTeam?.id}
            onChange={onSetAwayTeam}
          />
        </>
      )}

      <div className="buttons-container">
        <Button variant="transparent" onClick={onClickBack}>
          Back
        </Button>
        {currentTeam === "done" && (
          <Button variant="primary" onClick={onClickDone}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
