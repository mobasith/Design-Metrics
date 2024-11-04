import React from "react";

interface DesignCardProps {
  designId: number;
  designInput: string;
  designTitle: string;
  description: string;
  createdById: number;
  createdByName: string;
  createdAt: string; // Add this if you need to display the date
  rating?: number; // Optional property
}

const DesignCard: React.FC<DesignCardProps> = ({
  designId,
  designInput,
  designTitle,
  description,
  createdById,
  createdByName,
  createdAt,
  rating,
}) => {
  return (
    <div className="border rounded-md p-4">
      <h2 className="text-xl font-semibold">{designTitle}</h2>
      <p>{description}</p>
      <p>
        Created by: {createdByName} (ID: {createdById})
      </p>
      <p>Created at: {new Date(createdAt).toLocaleDateString()}</p>
      {rating && <p>Rating: {rating}</p>}
    </div>
  );
};

export default DesignCard;
