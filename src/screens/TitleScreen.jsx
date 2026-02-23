import Button from "../components/button/Button";

export default function TitleScreen({ onStart }) {
  return (
    <div className="image-container">
      <img src="/images/title-screen.png" alt="Power Baseball 3000" />
      <div className="menu">
        <Button variant="transparent" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}