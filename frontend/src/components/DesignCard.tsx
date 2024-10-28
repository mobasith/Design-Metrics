// src/components/DesignCard.tsx
import React from "react";

interface DesignCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  onClick: () => void; // Ensure onClick is defined here
}

const DesignCard: React.FC<DesignCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded shadow hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <img src={imageUrl} alt={title} className="w-full h-48 rounded-t" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default DesignCard;
