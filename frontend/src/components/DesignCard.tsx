import React from 'react';

interface DesignCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  dislikes: number;
  onClick: () => void;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  likes,
  dislikes,
  onClick,
  onLike,
  onDislike,
}) => {
  return (
    <div className="border rounded-md p-4">
      <img src={imageUrl} alt={title} className="w-full h-32 object-cover" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p>{description}</p>
      <div className="flex justify-between items-center mt-2">
        <div>
          <button onClick={() => onLike(id)} className="text-blue-500">
            Like {likes}
          </button>
          <button onClick={() => onDislike(id)} className="text-red-500 ml-2">
            Dislike {dislikes}
          </button>
        </div>
        <button onClick={onClick} className="text-gray-500">
          View
        </button>
      </div>
    </div>
  );
};

export default DesignCard;
