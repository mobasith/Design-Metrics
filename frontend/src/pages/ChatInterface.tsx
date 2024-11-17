import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  UserCircle2,
  Users,
  PlusCircle,
  Search,
  ArrowLeft,
  MoreVertical,
  Trash2,
} from "lucide-react";

// Types
interface User {
  id: string;
  name: string;
  role: "user" | "designer";
  avatar?: string;
  lastSeen?: Date;
  online?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image";
}

interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  isGroup: boolean;
  groupName?: string;
  lastMessage?: Message;
}

const currentUser: User = {
  id: "1",
  name: "John Doe",
  role: "designer",
};

const ChatInterface: React.FC = () => {
  const [view, setView] = useState<"chats" | "users" | "chat">("chats");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState<string | false>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const chatName = chat.isGroup
      ? chat.groupName
      : chat.participants.find((p) => p.id !== currentUser.id)?.name;
    return chatName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleBack = () => {
    if (view === "chat") {
      setView("chats");
      setSelectedChat(null);
    } else if (view === "users") {
      setView("chats");
    }
  };

  const handleUserSelect = (user: User) => {
    // Check if chat already exists
    const existingChat = chats.find(
      (chat) => !chat.isGroup && chat.participants.some((p) => p.id === user.id)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat: Chat = {
        id: Date.now().toString(),
        participants: [currentUser, user],
        messages: [],
        isGroup: false,
      };
      setChats((prev) => [...prev, newChat]);
      setSelectedChat(newChat);
    }
    setView("chat");
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
      setView("chats");
    }
    setShowChatOptions(false);
  };

  const handleCreateNewGroup = (groupName: string, selectedUsers: User[]) => {
    const newGroupChat: Chat = {
      id: Date.now().toString(),
      participants: [currentUser, ...selectedUsers],
      messages: [],
      isGroup: true,
      groupName,
    };
    setChats((prev) => [...prev, newGroupChat]);
    setSelectedChat(newGroupChat);
    setShowNewGroupModal(false);
    setView("chat");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3 mb-4">
            {view !== "chats" && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h2 className="text-xl font-semibold">
              {view === "chats"
                ? "Chats"
                : view === "users"
                ? "Users"
                : "Messages"}
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {view === "chats" && (
            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full">
                  All
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full">
                  Groups
                </button>
              </div>
              <button
                onClick={() => setView("users")}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-full"
              >
                New Chat
              </button>
            </div>
          )}
        </div>

        {/* List content */}
        <div className="flex-1 overflow-y-auto">
          {view === "users"
            ? // Users list
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="p-4 border-b cursor-pointer hover:bg-gray-50 flex items-center space-x-3"
                >
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ml-auto ${
                      user.online ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>
              ))
            : // Chats list
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="relative p-4 border-b cursor-pointer hover:bg-gray-50"
                >
                  <div
                    onClick={() => {
                      setSelectedChat(chat);
                      setView("chat");
                    }}
                    className="flex items-center space-x-3"
                  >
                    {chat.isGroup ? (
                      <Users className="w-12 h-12 text-gray-400" />
                    ) : (
                      <UserCircle2 className="w-12 h-12 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {chat.isGroup
                          ? chat.groupName
                          : chat.participants.find(
                              (p) => p.id !== currentUser.id
                            )?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {chat.lastMessage?.content.substring(0, 30) ||
                          "No messages yet"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChatOptions(chat.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical size={20} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Chat options dropdown */}
                  {showChatOptions === chat.id && (
                    <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg py-2 z-10">
                      <button
                        onClick={() => handleDeleteChat(chat.id)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
        </div>

        {/* Create group button for designers */}
        {currentUser.role === "designer" && view === "chats" && (
          <button
            onClick={() => setShowNewGroupModal(true)}
            className="p-4 text-white bg-blue-600 rounded-full fixed bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <PlusCircle size={40} />
          </button>
        )}
      </div>

      {/* Chat content */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {selectedChat ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 bg-white shadow-md flex items-center space-x-3">
              {selectedChat.isGroup ? (
                <Users className="w-12 h-12 text-gray-400" />
              ) : (
                <UserCircle2 className="w-12 h-12 text-gray-400" />
              )}
              <div>
                <h3 className="font-medium">
                  {selectedChat.isGroup
                    ? selectedChat.groupName
                    : selectedChat.participants.find(
                        (p) => p.id !== currentUser.id
                      )?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.participants
                    .filter((p) => p.id !== currentUser.id)
                    .map((p) => p.name)
                    .join(", ")}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.senderId === currentUser.id
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`inline-block text-sm px-4 py-2 rounded-lg ${
                        message.senderId === currentUser.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t flex items-center space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (!message.trim()) return;
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    senderId: currentUser.id,
                    content: message,
                    timestamp: new Date(),
                    type: "text",
                  };
                  setSelectedChat((prev) => {
                    if (prev) {
                      return {
                        ...prev,
                        messages: [...prev.messages, newMessage],
                        lastMessage: newMessage,
                      };
                    }
                    return prev;
                  });
                  setMessage("");
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="p-2 text-blue-600"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-medium mb-4">Create New Group</h3>
            <input
              type="text"
              placeholder="Group Name"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="mb-4">
              <h4 className="text-lg">Select Users</h4>
              <div>
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <input type="checkbox" id={user.id} className="mr-2" />
                    <label htmlFor={user.id}>{user.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateNewGroup("My New Group", users)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
