// src/pages/DetailDesign.tsx
import React from "react";
import { useParams } from "react-router-dom";

const DetailDesign: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // You would typically fetch the design details based on the ID here
  // For now, let's use placeholder content
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">Detail Design {id}</h1>
      <img
        src={`/images/Hero.avif`}
        alt={`Design ${id}`}
        className="w-full h-auto mb-4"
      />
      <p>This is the detail description for design {id}.</p>
      {/* You can add more detail about the design here */}
    </div>
  );
};

export default DetailDesign;
