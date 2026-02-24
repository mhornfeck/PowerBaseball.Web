import { useState } from "react";
import TitleScreen from "./screens/TitleScreen";
import GameSetupScreen from "./screens/GameSetupScreen";
import { TeamSetup } from "./models/TeamSetup"
import "./App.css";
import GameRunnerScreen from "./screens/GameRunnerScreen";
import { GameEngineService } from "./api/generated";
import { usePlayer } from "./context/PlayerContext";
import { useGame } from "./context/GameContext";

export default function App() {
  const [screen, setScreen] = useState("title");
  const [teams, setTeams] = useState<TeamSetup | undefined>(undefined);

  const { playerId } = usePlayer();
  const { setGame } = useGame();

  const onTeamSetup = async (teamSetup: TeamSetup) => {
    setTeams(teamSetup);

    const newGame = await GameEngineService.postGameEngineNew({
      homeTeam: {
        id: teamSetup.homeTeam.teamId
      },
      awayTeam: {
        id: teamSetup.awayTeam.teamId,
        playerIds: [ playerId ]
      }
    })

    if (newGame?.data) {
      setGame(newGame.data);
      setScreen('game-runner');
    }
  }

  return (
    <>
      {screen === "title" && (
        <TitleScreen onStart={() => setScreen("setup")} />
      )}

      {screen === "setup" && (
        <GameSetupScreen onBack={() => setScreen("title")} onDone={onTeamSetup} />
      )}

      {screen === "game-runner" && (
        <GameRunnerScreen onBack={() => setScreen("setup")} />
      )}
    </>
  );
}