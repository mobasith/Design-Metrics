import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void; // Optional click handler
  disabled?: boolean; // Option to disable the button
  type?: "button" | "submit" | "reset"; // Optional type with specific values
  className?: string; // Additional optional styling
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled = false,
  type = "button", // Default to "button"
  className = "",
}) => {
  return (
    <button
      type={type} // Use the dynamic type
      onClick={onClick}
      disabled={disabled} // Disable the button if needed
      className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {text}
    </button>
  );
};

export default Button;
