import "./GameRunnerScreen.css";
import Scoreboard from "../components/scoreboard/Scoreboard";
import LineupPanel from "../components/lineup-panel/LineupPanel";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import { usePlayer } from "../context/PlayerContext";
import {
  Batter,
  GameEngineService,
  GameEngineStateType,
  GameTeam,
  GameTeamMode,
} from "../api/generated";
import { PlayerLine } from "../types/game";
import BatterStats from "../components/batter-stats/BatterStats";
import UserControl from "../components/user-control/UserControl";
import { PitchInput, PitchLocation, PitchType } from "../types/pitch";
import atBatLoader from "../assets/baseball-loader.gif";
import { AtBatResultOverlay } from "../components/at-bat-result-overlay/AtBatResultOverlay";
import { BaseRunnersPanel } from "../components/base-runners-panel/BaseRunnersPanel";
import { BatterCard } from "../components/batter-card/BatterCard";
import FinalScore, {
  FinalScoreProps,
} from "../components/final-score/FinalScore";
import GamePlayersPanel, {
  GamePlayer,
} from "../components/game-players-panel/GamePlayersPanel";

interface GameRunnerScreenProps {
  onEndGame: () => void;
}

export default function GameRunnerScreen({ onEndGame }: GameRunnerScreenProps) {
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

  function getFinalScore(): FinalScoreProps {
    const home = game?.game.homeTeam!;
    const away = game?.game.awayTeam!;

    const winningTeam = home.score! > away.score! ? home : away;
    const losingTeam = home.score! > away.score! ? away : home;

    return {
      winningTeamName: winningTeam.city!,
      winningScore: winningTeam.score!,
      losingScore: losingTeam.score!,
      onDone: onEndGame,
    };
  }

  function getPlayers(team: GameTeam): Array<GamePlayer> | undefined {
    return team.players?.map((player) => {
      return { id: player.id, name: player.id };
    });
  }

  const awayTeamHumanPlayers = getPlayers(game?.away);
  const homeTeamHumanPlayers = getPlayers(game?.home);

  return (
    <div className="game-runner-container">
      {/* HEADER */}

      {/* AWAY COLUMN */}
      <div className="team-column">
        <LineupPanel
          teamName={game.away.team.city!}
          players={game.away.team.lineup!.batters!.map((batter: Batter) => ({
            jerseyNumber: batter.jerseyNumber,
            name: batter.name!,
            hits: batter.statistics!.hits!,
            atBats: batter.statistics!.atBats!,
          }))}
          currentBatterId={game.away.team.currentBatter!.jerseyNumber}
          onPlayerClick={setSelectedPlayer}
        />

        {game.away.mode === GameTeamMode.HUMAN &&
          awayTeamHumanPlayers &&
          awayTeamHumanPlayers?.length > 0 && (
            <GamePlayersPanel
              players={awayTeamHumanPlayers}
              activePlayerId={game?.away?.activePlayer?.id}
              gameId={game?.gameId}
            />
          )}

        {game.game.inning?.inningHalf === "Top" && (
          <div className="away-batter">
            <BatterCard batter={game.game.battingTeam?.currentBatter!} />
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
          {!isAtBatProcessing && <UserControl onSubmitInput={handleInput} />}
          {isAtBatProcessing && (
            <div className="at-bat-processing-overlay">
              <img src={atBatLoader} alt="Processing at bat..." />
            </div>
          )}
          {game?.currentState.stateType === GameEngineStateType.GAME_END && (
            <FinalScore {...getFinalScore()} />
          )}
        </div>
      </div>

      {/* HOME COLUMN */}
      <div className="team-column">
        <LineupPanel
          teamName={game.home.team.city!}
          players={game.home.team.lineup!.batters!.map((batter: Batter) => ({
            jerseyNumber: batter.jerseyNumber,
            name: batter.name!,
            hits: batter.statistics!.hits!,
            atBats: batter.statistics!.atBats!,
          }))}
          currentBatterId={game.home.team.currentBatter!.jerseyNumber}
          onPlayerClick={setSelectedPlayer}
        />

        {game.home.mode === GameTeamMode.HUMAN &&
          homeTeamHumanPlayers &&
          homeTeamHumanPlayers?.length > 0 && (
            <GamePlayersPanel
              players={homeTeamHumanPlayers}
              activePlayerId={game?.home?.activePlayer?.id}
              gameId={game?.gameId}
            />
          )}

        {game.game.inning?.inningHalf === "Bottom" && (
          <div className="home-batter">
            <BatterCard batter={game.game.battingTeam?.currentBatter!} />
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
