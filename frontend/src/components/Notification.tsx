import React from "react";

interface NotificationProps {
  notifications: { id: number; message: string }[];
}

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div className="relative">
      <button className="p-2 bg-blue-500 text-white rounded">
        Notifications
      </button>
      <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded z-10">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-2 border-b">
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
