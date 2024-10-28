// ReviewCard.tsx
import React from 'react';

interface ReviewCardProps {
  imageSrc: string;
  reviewText: string;
  reviewerName: string;
  rating: number; // Add rating prop
}

const ReviewCard: React.FC<ReviewCardProps> = ({ imageSrc, reviewText, reviewerName, rating }) => {
  // Function to generate star rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-500' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg flex items-start space-x-4">
      <img src={imageSrc} alt={reviewerName} className="w-16 h-16 rounded-full" />
      <div>
        <div className="flex items-center mb-2">
          {renderStars()} {/* Render stars based on the rating */}
        </div>
        <p className="text-lg mb-2">{reviewText}</p>
        <p className="text-sm text-gray-500">- {reviewerName}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
