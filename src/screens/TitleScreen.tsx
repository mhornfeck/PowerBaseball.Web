import Button from "../components/button/Button";

interface TitleScreenScreenProps {
  onStart: () => void
};

export default function TitleScreen({ onStart }: TitleScreenScreenProps) {
  return (
    <div className="image-container">
      <img src="/images/title-screen.png" alt="Power Baseball 3000" />
      <div className="menu">
        <Button variant="primary" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}