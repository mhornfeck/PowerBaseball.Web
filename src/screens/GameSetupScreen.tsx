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

  const onSetTeams = (homeTeam: TeamListingModel, awayTeam: TeamListingModel) => {
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

  const onClickBack = () => {
    onBack();
  }

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

      <div className="team-selection-container">
        <TeamSelection
          teams={teams}
          onSubmit={onSetTeams}
        />
      </div>
    </div>
  );
}
