import "./GameRunnerScreen.css";
import Scoreboard from "../components/scoreboard/Scoreboard";
import LineupPanel from "../components/lineup-panel/LineupPanel";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import { usePlayer } from "../context/PlayerContext";
import { GameEngineService, GameEngineStateType, GameTeamMode } from "../api/generated";
import { PlayerLine } from "../types/game";
import BatterStats from "../components/batter-stats/BatterStats";
import UserControl from "../components/user-control/UserControl";
import { PitchInput, PitchLocation, PitchType } from "../types/pitch";
import atBatLoader from "../assets/baseball-loader.gif";
import { AtBatResultOverlay } from "../components/at-bat-result-overlay/AtBatResultOverlay";
import { BaseRunnersPanel } from "../components/base-runners-panel/BaseRunnersPanel";
import { BatterCard } from "../components/batter-card/BatterCard";
import FinalScore from "../components/final-score/FinalScore";
import GamePlayersPanel from "../components/game-players-panel/GamePlayersPanel";
import { SideChangeSummary } from "../components/side-change-summary/SideChangeSummary";

interface GameRunnerScreenProps {
  onEndGame: () => void;
}

export default function GameRunnerScreen({ onEndGame }: GameRunnerScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerLine | null>(null);

  const {
    game,
    lastAtBatResult,
    isAtBatProcessing,
    lastSideChange,
    lineups,
    stateType,
    finalScore,
    rosters,
  } = useGame();
  const { playerId } = usePlayer();

  console.log("Current Game State:", stateType);

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
      {/* HEADER */}

      {/* AWAY COLUMN */}
      <div className="team-column">
        <LineupPanel
          teamName={lineups.away.teamName}
          players={lineups.away.players}
          currentBatterId={lineups.away.currentBatter?.jerseyNumber}
          onPlayerClick={setSelectedPlayer}
        />

        {rosters.away.mode === GameTeamMode.HUMAN &&
          rosters.away.humanPlayers.length > 0 && (
            <GamePlayersPanel
              players={rosters.away.humanPlayers}
              activePlayerId={rosters.away.activePlayerId ?? undefined}
              gameId={game.gameId}
            />
          )}

        {game.game.inning?.inningHalf === "Top" &&
          lineups.away.currentBatter && (
            <div className="away-batter">
              <BatterCard batter={lineups.away.currentBatter} />
            </div>
          )}
      </div>

      {/* CENTER GAME DISPLAY */}
      <div className="center-column">
        <div className="scoreboard-area">
          <Scoreboard />
          <BaseRunnersPanel />
        </div>
        <div className="game-display">
          {lastAtBatResult && <AtBatResultOverlay result={lastAtBatResult} />}
          {stateType === GameEngineStateType.INNING_END && lastSideChange && (
            <SideChangeSummary snapshot={lastSideChange} />
          )}
          {!isAtBatProcessing && <UserControl onSubmitInput={handleInput} />}
          {isAtBatProcessing && (
            <div className="at-bat-processing-overlay">
              <img src={atBatLoader} alt="Processing at bat..." />
            </div>
          )}
          {stateType === GameEngineStateType.GAME_END && finalScore && (
            <FinalScore {...finalScore} onDone={onEndGame} />
          )}
        </div>
      </div>

      {/* HOME COLUMN */}
      <div className="team-column">
        <LineupPanel
          teamName={lineups.home.teamName}
          players={lineups.home.players}
          currentBatterId={lineups.home.currentBatter?.jerseyNumber}
          onPlayerClick={setSelectedPlayer}
        />

        {rosters.home.mode === GameTeamMode.HUMAN &&
          rosters.home.humanPlayers.length > 0 && (
            <GamePlayersPanel
              players={rosters.home.humanPlayers}
              activePlayerId={rosters.home.activePlayerId ?? undefined}
              gameId={game.gameId}
            />
          )}

        {game.game.inning?.inningHalf === "Bottom" &&
          lineups.home.currentBatter && (
            <div className="home-batter">
              <BatterCard batter={lineups.home.currentBatter} />
            </div>
          )}
      </div>

      {/* MODALS / OVERLAYS */}

      {selectedPlayer && (
        <BatterStats
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
