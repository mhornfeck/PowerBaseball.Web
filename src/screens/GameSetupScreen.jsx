import Button from "../components/button/Button";

export default function GameSetupScreen({ onBack }) {
  return (
    <div>
      <h1>Game Setup</h1>
      <Button variant="transparent" onClick={onBack}>
        Back
      </Button>
    </div>
  );
}