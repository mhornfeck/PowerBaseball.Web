import type { SideChangeOccurredSnapshot } from "../api/generated";
import { AtBatResolvedSnapshot, GameStateUpdatedSnapshot } from "./snapshots";

export type SignalREvents = {
  GameStateUpdated: GameStateUpdatedSnapshot;
  AtBatResolved: AtBatResolvedSnapshot;
  SideChangeOccurred: SideChangeOccurredSnapshot;
};
