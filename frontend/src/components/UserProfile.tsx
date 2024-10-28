// src/components/UserProfile.tsx
import React from "react";

interface UserProfileProps {
  name: string;
  profileImage: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, profileImage }) => (
  <div className="flex items-center space-x-4">
    <img
      src={profileImage}
      alt={name}
      className="w-16 h-16 rounded-full object-cover"
    />
    <h1 className="text-2xl font-bold">{name}</h1>
  </div>
);

export default UserProfile;
