import "./GamePlayersPanel.css";
import userAvatarDefault from "../../assets/user-avatar-default.png";

export type GamePlayer = {
  id: string;
  name: string;
};

type Props = {
  players: GamePlayer[];
  activePlayerId?: string;
};

export default function GamePlayersPanel({ players, activePlayerId }: Props) {
  return (
    <div className="game-players-panel">
      {players.map((player) => {
        const isActive = player.id === activePlayerId;

        return (
          <div
            key={player.id}
            className={`game-player ${isActive ? "active" : ""}`}
          >
            <img className="avatar" src={userAvatarDefault} alt="avatar" />
            <span className="player-name">{player.name}</span>
          </div>
        );
      })}
    </div>
  );
}
