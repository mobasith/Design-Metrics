import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void; // Make onClick optional
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      type="submit" // This button will act as a submit button
    >
      {text}
    </button>
  );
};

export default Button;
