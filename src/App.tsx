import { useState } from "react";
import TitleScreen from "./screens/TitleScreen";
import GameSetupScreen from "./screens/GameSetupScreen";
import { TeamSetup } from "./models/TeamSetup"
import "./App.css";
import GameRunnerScreen from "./screens/GameRunnerScreen";

export default function App() {
  const [screen, setScreen] = useState("title");
  const [teams, setTeams] = useState<TeamSetup | undefined>(undefined);

  const onTeamSetup = (teamSetup: TeamSetup) => {
    setTeams(teamSetup);
    setScreen('game-runner');
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