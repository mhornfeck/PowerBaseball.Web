import { GameTeamMode } from "../api/generated";
import type {
  Batter,
  BattingLogEntry,
  GamePlayer,
  GameTeam,
  Team,
} from "../api/generated";
import type { GameState } from "../context/GameContext";
import type {
  ActivePlayerInfo,
  BaseRunners,
  BatterCardInfo,
  BatterInfo,
  BatterLogEntry,
  FinalScoreState,
  HumanPlayer,
  Lineups,
  PlayerLine,
  Rosters,
  ScoreboardState,
  TeamBoxScore,
  TeamLineup,
  TeamRoster,
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

function mapPlayerLine(batter: Batter): PlayerLine {
  return {
    jerseyNumber: batter.jerseyNumber,
    name: batter.name ?? `${batter.firstName} ${batter.lastName}`,
    hits: batter.statistics?.hits ?? 0,
    atBats: batter.statistics?.atBats ?? 0,
  };
}

function mapBatterLogEntry(entry: BattingLogEntry): BatterLogEntry {
  return {
    inning: entry.inning ?? 0,
    resultType: entry.resultType ?? "Out",
  };
}

function mapBatterCard(batter: Batter): BatterCardInfo {
  return {
    jerseyNumber: batter.jerseyNumber,
    firstName: batter.firstName,
    lastName: batter.lastName,
    todayHits: batter.statistics?.hits ?? 0,
    todayAtBats: batter.statistics?.atBats ?? 0,
    log: batter.log?.entries?.map(mapBatterLogEntry) ?? [],
    seasonAvgDisplay: batter.statistics?.battingAverageDisplay ?? "",
    seasonSlgDisplay: batter.statistics?.sluggingPercentageDisplay ?? "",
    seasonHomeruns: batter.statistics?.homeruns ?? 0,
    seasonRbi: batter.statistics?.runsBattedIn ?? 0,
  };
}

function mapTeamLineup(team: Team | undefined): TeamLineup {
  return {
    teamName: team?.city ?? "",
    players: team?.lineup?.batters?.map(mapPlayerLine) ?? [],
    currentBatter: team?.currentBatter
      ? mapBatterCard(team.currentBatter)
      : null,
  };
}

export function mapLineups(game: GameState | null): Lineups {
  return {
    home: mapTeamLineup(game?.home.team),
    away: mapTeamLineup(game?.away.team),
  };
}

export function mapFinalScore(game: GameState | null): FinalScoreState {
  const home = game?.game.homeTeam;
  const away = game?.game.awayTeam;
  if (!home || !away) return null;

  const homeScore = home.score ?? 0;
  const awayScore = away.score ?? 0;
  const winningTeam = homeScore > awayScore ? home : away;

  return {
    winningTeamName: winningTeam.city ?? "",
    winningScore: Math.max(homeScore, awayScore),
    losingScore: Math.min(homeScore, awayScore),
  };
}

function mapHumanPlayer(player: GamePlayer): HumanPlayer {
  return { id: player.id, handle: player.username };
}

function mapTeamRoster(team: GameTeam | undefined): TeamRoster {
  return {
    mode: team?.mode ?? GameTeamMode.COMPUTER,
    humanPlayers: team?.players?.map(mapHumanPlayer) ?? [],
    activePlayerId: team?.activePlayer?.id ?? null,
  };
}

export function mapRosters(game: GameState | null): Rosters {
  return {
    home: mapTeamRoster(game?.home),
    away: mapTeamRoster(game?.away),
  };
}
