import { AtBatResultType } from "../api/generated/models/AtBatResultType";
import { Batter } from "../api/generated/models/Batter";
import { GameEngineData } from "../api/generated/models/GameEngineData";
import { GameEngineStateType } from "../api/generated/models/GameEngineStateType";
import { InningHalf } from "../api/generated/models/InningHalf";
import { Team } from "../api/generated/models/Team";

export enum InningStatus {
  INPROGRESS = "InProgress",
  COMPLETE = "Complete",
}

export type AtBatResult = {
  resultType: AtBatResultType;
  batter: Batter;
};

export interface GameStateUpdatedSnapshot {
  gameId: string;
  stateType: GameEngineStateType;
  data: GameEngineData;
}

export interface AtBatResolvedSnapshot {
  gameId: string;
  result: AtBatResult;
  inningStatus: InningStatus;
}

export interface HalfInningSummary {
  runs: number;
  hits: number;
  leftOnBase: number;
}

export interface SideChangeOccurredSnapshot {
  gameId: string;
  inningNumber: number;
  inningHalf: InningHalf;
  battingTeam: Team;
  pitchingTeam: Team;
  summary: HalfInningSummary;
  dueUp: Batter[];
}
