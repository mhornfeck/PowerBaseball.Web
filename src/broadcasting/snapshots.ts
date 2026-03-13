import { AtBatResultType } from "../api/generated/models/AtBatResultType";
import { Batter } from "../api/generated/models/Batter";
import { GameEngineData } from "../api/generated/models/GameEngineData";
import { GameEngineStateType } from "../api/generated/models/GameEngineStateType";

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
