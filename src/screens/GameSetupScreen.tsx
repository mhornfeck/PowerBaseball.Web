import { useState, useEffect } from "react";
import { TeamsService, TeamListingModel } from "../api/generated";
import TeamSelection from "../components/team-selection/TeamSelection";
import Button from "../components/button/Button";
import { TeamSetup } from "../models/TeamSetup";
import "./GameSetupScreen.css";
import TextInput from "../components/text-input/TextInput";
import { usePlayer } from "../context/PlayerContext";

interface GameSetupScreenProps {
  onBack: () => void;
  onDone: (teamSetup: TeamSetup) => void;
  onJoin: (gameId: string, playerHandle: string) => void;
}

type GameSetupStep =
  | "game-type-selection"
  | "new-game"
  | "new-game-player-select"
  | "join-game";

export default function GameSetupScreen({
  onBack,
  onDone,
  onJoin,
}: GameSetupScreenProps) {
  const [teams, setTeams] = useState<TeamListingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinGameCode, setJoinGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const [step, setStep] = useState<GameSetupStep>("game-type-selection");

  const { setPlayerHandle, playerId } = usePlayer();

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

    setPlayerHandle(playerName);
    onDone(teamSetup);
  };

  const onClickBack = () => {
    if (step === "new-game-player-select" || step === "join-game")
      setStep("game-type-selection");
    else if (step === "new-game") setStep("new-game-player-select");
    else onBack();
  };

  const onClickNewGame = async () => {
    setStep("new-game-player-select");
  };

  const onClickSetPlayer = async () => {
    setStep("new-game");
    await loadTeams();
  };

  const onClickJoinGame = () => {
    setStep("join-game");
  };

  const joinGame = () => {
    setPlayerHandle(playerName);
    onJoin(joinGameCode, playerName);
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
      {step === "new-game-player-select" && (
        <div className="join-game">
          <TextInput
            value={playerName}
            placeholder="Enter player name"
            onChange={setPlayerName}
          />
          <div className="buttons-container">
            <Button variant="transparent" onClick={onClickBack}>
              Back
            </Button>
            <Button variant="primary" onClick={onClickSetPlayer}>
              Next
            </Button>
          </div>
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
            value={playerName}
            placeholder="Enter player name"
            onChange={setPlayerName}
          />
          <TextInput
            value={joinGameCode}
            placeholder="Enter game code"
            onChange={setJoinGameCode}
          />
          <div className="buttons-container">
            <Button variant="transparent" onClick={onClickBack}>
              Back
            </Button>
            <Button variant="primary" onClick={joinGame}>
              Join
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
