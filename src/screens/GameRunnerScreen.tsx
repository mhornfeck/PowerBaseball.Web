// /screens/GameRunnerScreen.tsx
import "./GameRunnerScreen.css";
import Button from "../components/button/Button";
import Scoreboard from "../components/scoreboard/Scoreboard";
import LineupPanel from "../components/lineup-panel/LineupPanel";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import { usePlayer } from "../context/PlayerContext";
import { Batter, GameEngineService } from "../api/generated";
import { PlayerLine } from "../types/game";
import BatterStats from "../components/batter-stats/BatterStats";
import UserControl from "../components/user-control/UserControl";
import { PitchInput, PitchLocation, PitchType } from "../types/pitch";
import atBatLoader from "../assets/baseball-loader.gif";
import { AtBatResultOverlay } from "../components/at-bat-result-overlay/AtBatResultOverlay";
import { BaseRunnersPanel } from "../components/base-runners-panel/BaseRunnersPanel";
import { BatterCard } from "../components/batter-card/BatterCard";

type GameRunnerScreenProps = {
  onBack: () => void;
};

export default function GameRunnerScreen({ onBack }: GameRunnerScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerLine | null>(null);

  const { game, lastAtBatResult, isAtBatProcessing } = useGame();
  const { playerId } = usePlayer();

  console.log("Current Game State:", game?.currentState.stateType);

  if (!game) {
    return <div>Loading game...</div>;
  }

  const handleInput = async (
    inputType: "batter-input" | "pitcher-input",
    input: PitchInput,
  ) => {
    try {
      await GameEngineService.postGameEngineEvent({
        eventType: inputType,
        gameId: game.gameId,
        playerId,
        pitchType: input.pitchType,
        pitchLocationHorizontal: input.location.horizontal,
        pitchLocationVertical: input.location.vertical,
      });
    } catch {
      console.error("Error posting game engine event.");
    }
  };

  return (
    <div className="game-runner-container">
      <div className="scoreboard-layout">
        <Scoreboard />
        <BaseRunnersPanel />
      </div>

      {lastAtBatResult && <AtBatResultOverlay result={lastAtBatResult} />}

      <div className="lineups-container">
        <LineupPanel
          teamName={game.away.team.city!}
          players={game.away.team.lineup!.batters!.map((batter: Batter) => {
            return {
              jerseyNumber: batter.jerseyNumber,
              name: batter.name!,
              hits: batter.statistics!.hits!,
              atBats: batter.statistics!.atBats!,
            };
          })}
          currentBatterId={game.away.team.currentBatter!.jerseyNumber}
          onPlayerClick={setSelectedPlayer}
        />

        <LineupPanel
          teamName={game.home.team.city!}
          players={game.home.team.lineup!.batters!.map((batter: Batter) => {
            return {
              jerseyNumber: batter.jerseyNumber,
              name: batter.name!,
              hits: batter.statistics!.hits!,
              atBats: batter.statistics!.atBats!,
            };
          })}
          currentBatterId={game.home.team.currentBatter!.jerseyNumber}
          onPlayerClick={setSelectedPlayer}
        />

        {selectedPlayer && (
          <BatterStats
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>

      {game.game.inning?.inningHalf !== undefined && (
        <div
          className={
            "batter-card-container " +
            (game.game.inning?.inningHalf === 0 ? "away" : "home")
          }
        >
          <BatterCard batter={game.game.battingTeam?.currentBatter!} />
        </div>
      )}

      {isAtBatProcessing && (
        <div className="processing-overlay">
          <img src={atBatLoader} alt="Processing at bat..." />
        </div>
      )}

      {!isAtBatProcessing && <UserControl onSubmitInput={handleInput} />}

      {/* Example Back button */}
      <div className="menu">
        <Button variant="primary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
