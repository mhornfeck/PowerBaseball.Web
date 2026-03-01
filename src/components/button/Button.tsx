import "./Button.css";
import { ReactNode, MouseEventHandler } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "transparent"; // add more variants if needed
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}