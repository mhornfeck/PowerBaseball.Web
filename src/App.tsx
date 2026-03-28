import { useState } from "react";
import TitleScreen from "./screens/TitleScreen";
import GameSetupScreen from "./screens/GameSetupScreen";
import { TeamSetup } from "./models/TeamSetup";
import "./App.css";
import GameRunnerScreen from "./screens/GameRunnerScreen";
import { GameEngineService } from "./api/generated";
import { useGame } from "./context/GameContext";
import { usePlayer } from "./context/PlayerContext";

export default function App() {
  const [screen, setScreen] = useState("title");

  const { setGame } = useGame();
  const { playerId } = usePlayer();

  const onJoin = async (gameId: string, playerHandle: string) => {
    const joinedGame = await GameEngineService.postGameEngineJoin({
      gameId: gameId,
      playerId: playerId,
      playerHandle: playerHandle,
    });

    if (joinedGame.data) {
      setGame(joinedGame.data);
      setScreen("game-runner");
    }
  };

  const onTeamSetup = async (teamSetup: TeamSetup) => {
    const newGame = await GameEngineService.postGameEngineNew({
      homeTeam: {
        id: teamSetup.homeTeam.teamId,
        players: teamSetup.homeTeam.player
          ? [
              {
                id: teamSetup.homeTeam.player.id,
                handle: teamSetup.homeTeam.player.handle,
              },
            ]
          : undefined,
      },
      awayTeam: {
        id: teamSetup.awayTeam.teamId,
        players: teamSetup.awayTeam.player
          ? [
              {
                id: teamSetup.awayTeam.player.id,
                handle: teamSetup.awayTeam.player.handle,
              },
            ]
          : undefined,
      },
    });

    if (newGame?.data) {
      setGame(newGame.data);
      setScreen("game-runner");
    }
  };

  return (
    <>
      {screen === "title" && <TitleScreen onStart={() => setScreen("setup")} />}

      {screen === "setup" && (
        <GameSetupScreen
          onBack={() => setScreen("title")}
          onDone={onTeamSetup}
          onJoin={onJoin}
        />
      )}

      {screen === "game-runner" && (
        <GameRunnerScreen onEndGame={() => setScreen("setup")} />
      )}
    </>
  );
}
