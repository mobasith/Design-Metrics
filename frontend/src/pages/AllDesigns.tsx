import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, Search, Sliders, Heart, Bookmark, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Home, Layout, Settings, LogOut, Upload } from "lucide-react"; // Import icons for the sidebar

interface Design {
  _id: string;
  designId: number;
  designInput: string; // Cloudinary image URL
  designTitle: string;
  description: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  commentCount?: number;
}

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white shadow-md fixed top-0 left-0 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">DesignMetrics</h2>
      </div>
      <nav className="mt-6">
        <div className="px-4">
          <div className="flex flex-col space-y-2">
            <a
              href="/user-dashboard"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a
              href="/all-designs"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Layout className="w-5 h-5 mr-3" />
              All Designs
            </a>
            {/* <a
              href="/upload"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Upload className="w-5 h-5 mr-3" />
              Upload Design
            </a> */}
            <a
              href="/profile"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
          </div>
        </div>
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <button className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

const DesignCard: React.FC<Design & { onLike: () => void }> = ({
  designTitle,
  description,
  createdByName,
  likeCount = 0,
  commentCount = 0,
  designInput,
  onLike,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={designInput}
        alt={designTitle}
        className="w-full h-48 object-cover object-center"
        onError={(e) => {
          e.currentTarget.src = "/images/Hero.avif"; // Fallback image
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{designTitle}</h3>
        <p className="text-gray-500">{description}</p>
        <p className="text-gray-400 text-sm">By {createdByName}</p>
        <div className="flex items-center justify-between mt-4">
          <button onClick={onLike} className="flex items-center text-pink-600 space-x-1">
            <Heart className="w-5 h-5" />
            <span>{likeCount}</span>
          </button>
          <button className="flex items-center text-gray-500 space-x-1">
            <MessageSquare className="w-5 h-5" />
            <span>{commentCount}</span>
          </button>
          <button onClick={toggleBookmark} className={`flex items-center space-x-1 ${isBookmarked ? 'text-blue-600' : 'text-gray-500'}`}>
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AllDesigns = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3002/api/designs");
      if (!response.ok) throw new Error("Failed to fetch designs");
      const data: Design[] = await response.json();
      setDesigns(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id: string) => {
    setDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
        design._id === id ? { ...design, likeCount: (design.likeCount || 0) + 1 } : design
      )
    );
  };

  const filteredAndSortedDesigns = designs
    .filter((design) =>
      design.designTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "rating":
          return (b.likeCount || 0) - (a.likeCount || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Design Gallery
          </h1>
          <p className="text-gray-600 mt-2">
            Explore and discover amazing designs from our community
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search designs..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <Sliders className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
              >
                Grid View
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
              >
                List View
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : (
          <div
            className={`grid ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            } gap-6`}
          >
            {filteredAndSortedDesigns.map((design) => (
              <DesignCard
                key={design._id}
                {...design}
                onLike={() => handleLike(design._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllDesigns;
