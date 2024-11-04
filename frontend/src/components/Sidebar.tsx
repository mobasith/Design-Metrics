import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

interface SidebarProps {
  name: string;
  profileImage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ name, profileImage }) => {
  const navigate = useNavigate();

  return (
    <aside className="bg-white shadow-lg p-6 w-64 flex flex-col">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-12 h-12">
          <AvatarImage src={profileImage} alt="User Avatar" />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-medium">{name}</h2>
          <p className="text-gray-500 text-sm">UI Designer</p>
        </div>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Button
              onClick={() => navigate("/user-dashboard")}
              variant="ghost"
              className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>User Dashboard</span>
            </Button>
          </li>
          {/* Add other menu items similarly */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
