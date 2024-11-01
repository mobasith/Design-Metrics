// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  name: string;
  profileImage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ name, profileImage }) => {
  return (
    <div className="w-64 h-screen fixed bg-gray-800 text-white flex flex-col items-center p-6">
      {/* User Profile Section */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={profileImage}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">{name}</span>
      </div>

      {/* Divider */}
      <hr className="border-gray-600 w-full mb-6" />

      {/* Search Field */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded-md border border-gray-500 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />

      {/* Navigation Links */}
      <div className="w-full space-y-4">
        <NavLink
          to="/all-designs"
          className={({ isActive }) =>
            `block text-lg px-4 py-2 rounded-md transition-colors ${
              isActive ? "bg-blue-500" : "hover:bg-blue-400"
            }`
          }
        >
          Designs
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block text-lg px-4 py-2 rounded-md transition-colors ${
              isActive ? "bg-blue-500" : "hover:bg-blue-400"
            }`
          }
        >
          Analytics
        </NavLink>
       
        <NavLink
          to="/submit-feedback"
          className={({ isActive }) =>
            `block text-lg px-4 py-2 rounded-md transition-colors ${
              isActive ? "bg-blue-500" : "hover:bg-blue-400"
            }`
          }
        >
          Feedback
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `block text-lg px-4 py-2 rounded-md transition-colors ${
              isActive ? "bg-blue-500" : "hover:bg-blue-400"
            }`
          }
        >
          Profile
        </NavLink>
        
      </div>
    </div>
  );
};

export default Sidebar;
