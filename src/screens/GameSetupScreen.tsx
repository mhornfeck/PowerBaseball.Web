import { useState } from "react";
import { TeamsService, TeamListingModel } from "../api/generated";
import TeamSelection from "../components/team-selection/TeamSelection";
import Button from "../components/button/Button";
import { TeamSetup } from "../models/TeamSetup";
import "./GameSetupScreen.css";
import TextInput from "../components/text-input/TextInput";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { playerDisplayName } from "../context/displayName";

interface GameSetupScreenProps {
  onBack: () => void;
  onDone: (teamSetup: TeamSetup) => void;
  onJoin: (gameId: string, playerHandle: string) => void;
}

type GameSetupStep = "game-type-selection" | "new-game" | "join-game";

export default function GameSetupScreen({
  onBack,
  onDone,
  onJoin,
}: GameSetupScreenProps) {
  const [teams, setTeams] = useState<TeamListingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinGameCode, setJoinGameCode] = useState("");

  const [step, setStep] = useState<GameSetupStep>("game-type-selection");

  const { playerId } = usePlayer();
  const { user } = useAuth();
  // App only renders this screen when signed in.
  const playerName = user ? playerDisplayName(user) : "";

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
        player: { id: playerId, handle: playerName },
      },
    };

    onDone(teamSetup);
  };

  const onClickBack = () => {
    if (step === "new-game" || step === "join-game")
      setStep("game-type-selection");
    else onBack();
  };

  const onClickNewGame = async () => {
    setStep("new-game");
    await loadTeams();
  };

  const onClickJoinGame = () => {
    setStep("join-game");
  };

  const joinGame = () => {
    onJoin(joinGameCode.trim(), playerName);
  };

  const loadTeams = async () => {
    try {
      const data = await TeamsService.getTeams();
      setTeams(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-setup-screen">
      <h1>Game Setup</h1>
      <p className="playing-as">Playing as {playerName}</p>

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
          {!loading && (
            <TeamSelection
              teams={teams}
              onSubmit={onSetTeams}
              onBack={onClickBack}
            />
          )}
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
            <Button variant="transparent" onClick={onClickBack}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={joinGame}
              disabled={!joinGameCode.trim()}
            >
              Join
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
