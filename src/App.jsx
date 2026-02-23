import { useState } from "react";
import TitleScreen from "./screens/TitleScreen";
import GameSetupScreen from "./screens/GameSetupScreen";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("title");

  return (
    <>
      {screen === "title" && (
        <TitleScreen onStart={() => setScreen("setup")} />
      )}

      {screen === "setup" && (
        <GameSetupScreen onBack={() => setScreen("title")} />
      )}
    </>
  );
}