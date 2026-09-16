import {
  AtBatResolvedSnapshot,
  GameStateUpdatedSnapshot,
  SideChangeOccurredSnapshot,
} from "./snapshots";

export type SignalREvents = {
  GameStateUpdated: GameStateUpdatedSnapshot;
  AtBatResolved: AtBatResolvedSnapshot;
  SideChangeOccurred: SideChangeOccurredSnapshot;
};
