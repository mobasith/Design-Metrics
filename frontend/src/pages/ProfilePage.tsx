import React from 'react';
import { 
  Home, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut,
  Mail,
  Lock
} from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <img
                src="/api/placeholder/48/48"
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div>
                <h2 className="font-semibold text-gray-800">John Doe</h2>
                <p className="text-sm text-gray-500">Premium Member</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                  <Trophy className="w-5 h-5" />
                  <span>My Achievements</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                  <Heart className="w-5 h-5" />
                  <span>Favorites</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-50 text-red-600">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Settings Content */}
        <div className="max-w-5xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <div className="flex gap-8">
            {/* Settings Sidebar */}
            <div className="w-64">
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">My details</h2>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Mail className="w-5 h-5 mr-3" />
                      Email
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="ml-auto w-40 px-2 py-1 text-sm border rounded"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Lock className="w-5 h-5 mr-3" />
                      Password
                      <input
                        type="password"
                        className="ml-auto w-40 px-2 py-1 text-sm border rounded"
                        placeholder="Change password"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
                <p className="text-gray-600">
                  Manage your email and password settings from this dashboard. 
                  Changes will be saved automatically when you update your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;