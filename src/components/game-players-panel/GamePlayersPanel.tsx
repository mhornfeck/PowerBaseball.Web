import "./GamePlayersPanel.css";
import userAvatarDefault from "../../assets/user-avatar-default.png";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import TextInput from "../text-input/TextInput";
import { useState } from "react";

export type GamePlayer = {
  id: string;
  handle: string;
};

type Props = {
  players: GamePlayer[];
  activePlayerId?: string;
  gameId?: string;
};

export default function GamePlayersPanel({
  players,
  activePlayerId,
  gameId,
}: Props) {
  const [showInviteDialog, setShowInviteDialog] = useState<boolean>(false);
  const onClickInvite = () => {
    setShowInviteDialog(true);
  };
  const onClickCopyInviteCode = async () => {
    if (!gameId) {
      return;
    }
    try {
      await navigator.clipboard.writeText(gameId);
      setShowInviteDialog(false);
      console.log("Copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <div className="game-players-panel panel">
      <div className="players-container">
        {players.map((player) => {
          const isActive = player.id === activePlayerId;

          return (
            <div
              key={player.id}
              className={`game-player ${isActive ? "active" : ""}`}
            >
              <img className="avatar" src={userAvatarDefault} alt="avatar" />
              <span className="player-name">{player.handle}</span>
            </div>
          );
        })}
      </div>
      {gameId && (
        <>
          <div className="buttons-container">
            <Button variant="link" size="compact" onClick={onClickInvite}>
              Invite
            </Button>
          </div>
          <Modal
            isOpen={showInviteDialog}
            onClose={() => {
              setShowInviteDialog(false);
            }}
          >
            <div className="invite-dialog">
              <TextInput
                value={gameId}
                disabled={true}
                className="game-id-input"
              ></TextInput>
              <div className="buttons-container">
                <Button onClick={onClickCopyInviteCode}>
                  Copy Invite Code
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
