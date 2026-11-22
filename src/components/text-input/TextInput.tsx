import React from "react";
import "./TextInput.css";

type TextInputProps = {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoFocus?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className = undefined,
  autoComplete,
  inputMode,
  autoFocus,
}) => {
  return (
    <div className="text-input-container">
      {label && <label className="text-input-label">{label}</label>}

      <input
        className={`text-input ${className ?? ""}`}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoFocus={autoFocus}
        disabled={disabled === true ? disabled : undefined}
        onChange={(e) => (onChange ? onChange(e.target.value) : undefined)}
      />
    </div>
  );
};

export default TextInput;
