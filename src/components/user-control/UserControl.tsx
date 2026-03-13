// components/UserControl.tsx
import { GameEngineStateType } from "../../api/generated";
import { useGame } from "../../context/GameContext";
import { PitchInput } from "../../types/pitch";
import BatterInputControl from "./batter-input/BatterInputControl";
import WaitForPlayersControl from "./WaitForPlayersControl";

interface UserControlProps {
  onSubmitInput: (inputType: 'batter-input' | 'pitcher-input', data: PitchInput) => void;
}

export default function UserControl({ onSubmitInput }: UserControlProps) {
  const { game } = useGame();

  if (!game) return null; // not loaded yet

  const onSubmitBatterInput = (data: PitchInput) => {
    onSubmitInput('batter-input', data);
  }

  const onSubmitPitcherInput = (data: PitchInput) => {
    onSubmitInput('pitcher-input', data);
  }

  switch (game.currentState.stateType) {
    case GameEngineStateType.WAIT_FOR_PLAYERS:
    case GameEngineStateType.INNING_END:
      return <WaitForPlayersControl />;
    case GameEngineStateType.GET_BATTER_INPUT:
      return <BatterInputControl onSubmit={onSubmitBatterInput} />;
    case GameEngineStateType.GET_PITCHER_INPUT:
      return <BatterInputControl onSubmit={onSubmitPitcherInput} />;
    default:
      return null;
  }
}
