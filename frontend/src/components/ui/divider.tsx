import React from "react";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className = "" }) => {
  return (
    <div
      className={`border-t border-gray-200 my-4 ${className}`}
      aria-hidden="true"
    />
  );
};

export { Divider };
