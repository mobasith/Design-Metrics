import React, { useState, useEffect } from "react";
import {
  Home,
  Settings,
  LogOut,
  User,
  Save,
  Key
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

interface UserData {
  userId: number;
  userName: string;
  email: string;
  roleId: number;
  role: string; // Added role field
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData>({
    userId: 0,
    userName: "",
    email: "",
    roleId: 0,
    role: "" // Initialize role
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserData({
          userId: Number(payload.userId),
          userName: payload.userName,
          email: payload.email,
          roleId: payload.roleId,
          role: payload.roleId === 1 ? "User" : "Designer" // Convert roleId to readable role
        });
      } catch (error) {
        console.error("Error parsing JWT token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({
        show: true,
        type: "error",
        message: "New passwords don't match",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/users/update/${userData.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setAlert({
          show: true,
          type: "success",
          message: "Password updated successfully",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update password",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Enhanced User Profile Section */}
          <div className="p-6 border-b">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-10 h-10 text-blue-500" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">{userData.userName}</h2>
                <p className="text-sm text-blue-600 font-medium">{userData.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
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
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/signin";
              }}
              className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

        {alert.show && (
          <Alert className={`mb-6 ${alert.type === "error" ? "bg-red-50" : "bg-green-50"}`}>
            <AlertDescription>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Account Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
              <p className="text-lg font-medium text-gray-800">{userData.userName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
              <p className="text-lg font-medium text-blue-600">{userData.role}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
              <p className="text-lg font-medium text-gray-800">{userData.email}</p>
            </div>
          </div>

          {/* Password Change Button with Modal */}
          <div className="mt-6 pt-6 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;