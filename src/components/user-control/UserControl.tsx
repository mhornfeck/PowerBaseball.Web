// components/UserControl.tsx
import { GameEngineStateType } from "../../api/generated";
import { useGame } from "../../context/GameContext";
import { PitchInput } from "../../types/pitch";
import BatterInputControl from "./batter-input/BatterInputControl";
import WaitForPlayersControl from "./WaitForPlayersControl";

interface UserControlProps {
  onSubmitInput: (
    inputType: "batter-input" | "pitcher-input",
    data: PitchInput,
  ) => void;
}

export default function UserControl({ onSubmitInput }: UserControlProps) {
  const { stateType, lastSideChange } = useGame();

  if (!stateType) return null; // not loaded yet

  const onSubmitBatterInput = (data: PitchInput) => {
    onSubmitInput("batter-input", data);
  };

  const onSubmitPitcherInput = (data: PitchInput) => {
    onSubmitInput("pitcher-input", data);
  };

  switch (stateType) {
    case GameEngineStateType.WAIT_FOR_PLAYERS:
      return <WaitForPlayersControl />;
    case GameEngineStateType.INNING_END:
      // GameRunnerScreen renders SideChangeSummary (which embeds its own
      // WaitForPlayersControl) whenever lastSideChange is present. Fall back
      // to a bare one here only if it's missing, so players always have a
      // way to advance.
      return lastSideChange ? null : <WaitForPlayersControl />;
    case GameEngineStateType.GET_BATTER_INPUT:
      return (
        <BatterInputControl
          onSubmit={onSubmitBatterInput}
          inputMode="batting"
        />
      );
    case GameEngineStateType.GET_PITCHER_INPUT:
      return (
        <BatterInputControl
          onSubmit={onSubmitPitcherInput}
          inputMode="pitching"
        />
      );
    default:
      return null;
  }
}
