import type { Batter, GamePlayer, GameTeam, Team } from "../api/generated";
import type { GameState } from "../context/GameContext";
import type {
  ActivePlayerInfo,
  BaseRunners,
  BatterInfo,
  ScoreboardState,
  TeamBoxScore,
  TurnState,
} from "../types/game";

function mapBatterInfo(batter?: Batter | null): BatterInfo | null {
  if (!batter) return null;

  return {
    jerseyNumber: batter.jerseyNumber,
    displayName: batter.name ?? `${batter.firstName} ${batter.lastName}`,
  };
}

export function mapBaseRunners(game: GameState | null): BaseRunners {
  return {
    first: mapBatterInfo(game?.game.firstBase),
    second: mapBatterInfo(game?.game.secondBase),
    third: mapBatterInfo(game?.game.thirdBase),
  };
}

function mapTeamBoxScore(
  boxTeam: Team | undefined,
  statsTeam: Team | undefined,
): TeamBoxScore {
  return {
    city: boxTeam?.city ?? null,
    boxScore: boxTeam?.boxScore ?? [],
    score: statsTeam?.score ?? 0,
    hits: statsTeam?.statistics?.hits ?? 0,
  };
}

export function mapScoreboard(game: GameState | null): ScoreboardState {
  const inning = game?.game.inning;

  return {
    inning:
      inning?.inningNumber != null && inning?.inningHalf
        ? { number: inning.inningNumber, half: inning.inningHalf }
        : null,
    isFinal: game?.game.isFinal ?? false,
    outs: game?.game.outs ?? 0,
    away: mapTeamBoxScore(game?.game.awayTeam, game?.away.team),
    home: mapTeamBoxScore(game?.game.homeTeam, game?.home.team),
  };
}

function mapActivePlayer(player?: GamePlayer | null): ActivePlayerInfo | null {
  if (!player) return null;

  return { id: player.id, name: player.username };
}

export function mapTurnState(game: GameState | null): TurnState {
  const battingTeamId = game?.game.battingTeam?.id;
  const teams: GameTeam[] = game ? [game.home, game.away] : [];

  const battingTeam = teams.find((t) => t.id === battingTeamId);
  const pitchingTeam = teams.find((t) => t.id !== battingTeamId);

  return {
    battingTeamName: game?.game.battingTeam?.city ?? null,
    battingTeamActivePlayer: mapActivePlayer(battingTeam?.activePlayer),
    pitchingTeamActivePlayer: mapActivePlayer(pitchingTeam?.activePlayer),
  };
}
