import { useState, useEffect } from "react";
import { TeamsService, TeamListingModel } from "../api/generated";
import TeamSelection from "../components/team-selection/TeamSelection";
import Button from "../components/button/Button";
import { TeamSetup } from "../models/TeamSetup";
import "./GameSetupScreen.css";
import TextInput from "../components/text-input/TextInput";

interface GameSetupScreenProps {
  onBack: () => void;
  onDone: (teamSetup: TeamSetup) => void;
}

type GameSetupStep = "game-type-selection" | "new-game" | "join-game";

export default function GameSetupScreen({
  onBack,
  onDone,
}: GameSetupScreenProps) {
  const [teams, setTeams] = useState<TeamListingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinGameCode, setJoinGameCode] = useState("");

  const [step, setStep] = useState<GameSetupStep>("game-type-selection");

  const onSetTeams = (
    homeTeam: TeamListingModel,
    awayTeam: TeamListingModel,
  ) => {
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
  };

  const onClickNewGame = async () => {
    setStep("new-game");
    await loadTeams();
  };

  const onClickJoinGame = () => {
    setStep("join-game");
  };

  const joinGame = () => {};

  const loadTeams = async () => {
    try {
      const data = await TeamsService.getTeams();
      setTeams(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Game Setup</h1>

      {step === "game-type-selection" && (
        <div className="game-type-selection">
          <Button variant="primary" onClick={onClickNewGame}>
            New Game
          </Button>
          <Button variant="primary" onClick={onClickJoinGame}>
            Join Game
          </Button>
        </div>
      )}
      {step === "new-game" && (
        <div className="team-selection-container">
          {loading && <div>Loading teams...</div>}
          {!loading && <TeamSelection teams={teams} onSubmit={onSetTeams} />}
        </div>
      )}
      {step === "join-game" && (
        <div className="join-game">
          <h3>Join Game</h3>
          <TextInput
            value={joinGameCode}
            placeholder="Enter game code"
            onChange={setJoinGameCode}
          />
          <div className="buttons-container">
            <Button variant="primary" onClick={joinGame}>
              Join
            </Button>
            <Button variant="transparent" onClick={onClickBack}>
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
