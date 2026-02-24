// components/UserControl.tsx
import { GameEngineStateType } from "../../api/generated";
import { useGame } from "../../context/GameContext"
import WaitForPlayersControl from "./WaitForPlayersControl";

export default function UserControl() {
  const { game } = useGame();

  if (!game) return null; // not loaded yet

  switch (game.currentState.stateType) {
    case GameEngineStateType.WAIT_FOR_PLAYERS:
      return <WaitForPlayersControl />;
    default:
      return null;
  }
}