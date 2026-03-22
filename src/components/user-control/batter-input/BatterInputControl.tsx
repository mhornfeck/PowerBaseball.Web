import { useState } from "react";
import SelectPitchTypePanel from "./SelectPitchTypePanel";
import { PitchLocation, PitchType } from "../../../types/pitch";
import SelectPitchLocationPanel from "./SelectPitchLocationPanel";
import { useCurrentPlayer } from "../../../hooks/useCurrentPlayer";

type BatterInputPhase = "SelectPitchType" | "SelectPitchLocation";

interface BatterInputProps {
  inputMode: "batting" | "pitching";
  onSubmit: (data: { pitchType: PitchType; location: PitchLocation }) => void;
}

export default function BatterInputControl({
  inputMode,
  onSubmit,
}: BatterInputProps) {
  const [phase, setPhase] = useState<BatterInputPhase>("SelectPitchType");
  const [selectedPitchType, setSelectedPitchType] = useState<PitchType | null>(
    null,
  );

  const { isActive, activePlayerName } = useCurrentPlayer(inputMode);

  const handleConfirm = (selectedLocation: PitchLocation) => {
    if (!selectedPitchType || !selectedLocation) return;

    onSubmit({
      pitchType: selectedPitchType,
      location: selectedLocation,
    });
  };

  if (isActive) {
    if (phase === "SelectPitchType") {
      return (
        <SelectPitchTypePanel
          onSelect={(pitchType: PitchType) => {
            setSelectedPitchType(pitchType);
            setPhase("SelectPitchLocation");
          }}
        />
      );
    }

    if (phase === "SelectPitchLocation") {
      return (
        <SelectPitchLocationPanel
          onSelect={(location) => {
            console.log("Pitch chosen:", selectedPitchType, location);
            handleConfirm(location);
          }}
        />
      );
    }
  } else {
    return (
      <div className="panel">
        <div className="panel-text">
          {activePlayerName} is currently {inputMode}...
        </div>
      </div>
    );
  }

  return null;
}
