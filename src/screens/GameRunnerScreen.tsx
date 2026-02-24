// /screens/GameRunnerScreen.tsx
import "./GameRunnerScreen.css";
import Button from "../components/button/Button";
import Scoreboard from "../components/scoreboard/Scoreboard";
import LineupPanel from "../components/lineup-panel/LineupPanel";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import { Batter } from "../api/generated";
import { PlayerLine } from "../types/game";
import BatterStats from "../components/batter-stats/BatterStats";
import UserControl from "../components/user-control/UserControl";

type GameRunnerScreenProps = {
  onBack: () => void;
};

export default function GameRunnerScreen({ onBack }: GameRunnerScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerLine | null>(null);

  const { game } = useGame();

  console.log("Current Game State:", game?.currentState.stateType);

  if (!game) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="game-runner-container">
      <Scoreboard
        awayTeam={game.away.team.city!}
        homeTeam={game.home.team.city!}
        awayScores={[0, 0, 0, 0, 0]}
        homeScores={[0, 0, 0, 0, 0]}
      />

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

      <UserControl />

      {/* Example Back button */}
      <div className="menu">
        <Button variant="primary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
