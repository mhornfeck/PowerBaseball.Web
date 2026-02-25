import {
  PitchLocation,
  PitchLocationHorizontal,
  PitchLocationVertical,
} from "../../../types/pitch";

type Props = {
  onSelect: (location: PitchLocation) => void;
};

export default function SelectPitchLocationPanel({ onSelect }: Props) {
  const handleLocationSelect = (
    horizontal: PitchLocationHorizontal,
    vertical: PitchLocationVertical,
  ) => {
    onSelect({ horizontal, vertical });
  };

  return (
    <div className="pitch-overlay">
      <div className="pitch-panel">
        <h3>Select Pitch Location</h3>

        <div className="strikezone-grid">
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Inside", "High")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Middle", "High")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Outside", "High")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Inside", "Medium")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Middle", "Medium")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Outside", "Medium")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Inside", "Low")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Middle", "Low")}
          />
          <button
            className="strikezone-cell"
            onClick={() => handleLocationSelect("Outside", "Low")}
          />
        </div>
      </div>
    </div>
  );
}
