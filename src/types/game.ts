export type PlayerLine = {
  jerseyNumber: number;
  name: string;
  hits: number;
  atBats: number;
};

export type AtBatResultType = 'Out' | 'Single' | 'Double' | 'Triple' | 'Homerun';

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