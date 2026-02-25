// components/UserControl.tsx
import { GameEngineStateType } from "../../api/generated";
import { useGame } from "../../context/GameContext";
import { PitchLocation, PitchType } from "../../types/pitch";
import BatterInputControl from "./batter-input/BatterInputControl";
import WaitForPlayersControl from "./WaitForPlayersControl";

interface UserControlProps {
  onSubmitBatterInput: (data: {
    pitchType: PitchType;
    location: PitchLocation;
  }) => void;
}

export default function UserControl({ onSubmitBatterInput }: UserControlProps) {
  const { game } = useGame();

  if (!game) return null; // not loaded yet

  switch (game.currentState.stateType) {
    case GameEngineStateType.WAIT_FOR_PLAYERS:
      return <WaitForPlayersControl />;
    case GameEngineStateType.GET_BATTER_INPUT:
    case GameEngineStateType.GET_PITCHER_INPUT:
      return <BatterInputControl onSubmit={onSubmitBatterInput} />;
    default:
      return null;
  }
}
