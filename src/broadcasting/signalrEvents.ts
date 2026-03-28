import { AtBatResolvedSnapshot, GameStateUpdatedSnapshot } from "./snapshots";

export type SignalREvents = {
  GameStateUpdated: GameStateUpdatedSnapshot;
  AtBatResolved: AtBatResolvedSnapshot;
};
