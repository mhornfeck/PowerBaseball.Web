import { useState } from "react";
import SelectPitchTypePanel from "./SelectPitchTypePanel";
import { PitchLocation, PitchType } from "../../../types/pitch";
import SelectPitchLocationPanel from "./SelectPitchLocationPanel";

type BatterInputPhase =
  | "SelectPitchType"
  | "SelectPitchLocation";

interface BatterInputProps {
  onSubmit: (data: {
    pitchType: PitchType;
    location: PitchLocation;
  }) => void;
}

export default function BatterInputControl({ onSubmit }: BatterInputProps) {
  const [phase, setPhase] = useState<BatterInputPhase>("SelectPitchType");
  const [selectedPitchType, setSelectedPitchType] = useState<PitchType | null>(null);

  const handleConfirm = (selectedLocation: PitchLocation) => {
    if (!selectedPitchType || !selectedLocation) return;

    onSubmit({
      pitchType: selectedPitchType,
      location: selectedLocation,
    });
  };

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

  return null;
}