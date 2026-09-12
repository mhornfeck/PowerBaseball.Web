import type { GameTeamMode } from "../api/generated";

export type PlayerLine = {
  jerseyNumber: number;
  name: string;
  hits: number;
  atBats: number;
};

export type AtBatResultType = 'Out' | 'Single' | 'Double' | 'Triple' | 'Homerun';

export type BatterLogEntry = {
  inning: number;
  resultType: AtBatResultType;
};

export type BatterCardInfo = {
  jerseyNumber: number;
  firstName: string;
  lastName: string;
  todayHits: number;
  todayAtBats: number;
  log: BatterLogEntry[];
  seasonAvgDisplay: string;
  seasonSlgDisplay: string;
  seasonHomeruns: number;
  seasonRbi: number;
};

export type BatterInfo = {
  jerseyNumber: number;
  displayName: string;
};

export type BaseRunners = {
  first: BatterInfo | null;
  second: BatterInfo | null;
  third: BatterInfo | null;
};

export type InningHalf = 'Top' | 'Bottom';

export type InningStatus = {
  number: number;
  half: InningHalf;
};

export type TeamBoxScore = {
  city: string | null;
  boxScore: Array<number | null>;
  score: number;
  hits: number;
};

export type ScoreboardState = {
  inning: InningStatus | null;
  isFinal: boolean;
  outs: number;
  away: TeamBoxScore;
  home: TeamBoxScore;
};

export type ActivePlayerInfo = {
  id: string;
  name: string;
};

export type TurnState = {
  battingTeamName: string | null;
  battingTeamActivePlayer: ActivePlayerInfo | null;
  pitchingTeamActivePlayer: ActivePlayerInfo | null;
};

export type TeamLineup = {
  teamName: string;
  players: PlayerLine[];
  currentBatter: BatterCardInfo | null;
};

export type Lineups = {
  home: TeamLineup;
  away: TeamLineup;
};

export type FinalScoreState = {
  winningTeamName: string;
  winningScore: number;
  losingScore: number;
} | null;

export type HumanPlayer = {
  id: string;
  handle: string;
};

export type TeamRoster = {
  mode: GameTeamMode;
  humanPlayers: HumanPlayer[];
  activePlayerId: string | null;
};

export type Rosters = {
  home: TeamRoster;
  away: TeamRoster;
};