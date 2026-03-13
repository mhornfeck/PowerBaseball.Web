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
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className = undefined,
}) => {
  return (
    <div className="text-input-container">
      {label && <label className="text-input-label">{label}</label>}

      <input
        className={`text-input ${className ?? ""}`}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => (onChange ? onChange(e.target.value) : undefined)}
      />
    </div>
  );
};

export default TextInput;
