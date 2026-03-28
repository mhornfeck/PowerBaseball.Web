import "./Button.css";
import { ReactNode, MouseEventHandler } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: "standard" | "compact";
  variant?: "primary" | "transparent" | "link"; // add more variants if needed
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "standard",
  type = "button",
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-size-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
