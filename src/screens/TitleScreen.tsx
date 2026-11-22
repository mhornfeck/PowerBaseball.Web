import Button from "../components/button/Button";
import { useAuth } from "../context/AuthContext";

interface TitleScreenScreenProps {
  onStart: () => void
};

export default function TitleScreen({ onStart }: TitleScreenScreenProps) {
  const { user, logout } = useAuth();

  return (
    <div className="image-container">
      <img src="/images/title-screen.png" alt="Power Baseball 3000" />
      <div className="menu">
        <Button variant="primary" onClick={onStart}>
          Start
        </Button>
      </div>
      {user && (
        <div className="signed-in-as">
          <span>Signed in as {user.email}</span>
          <Button variant="link" onClick={logout}>
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
