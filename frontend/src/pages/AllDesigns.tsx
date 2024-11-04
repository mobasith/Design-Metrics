import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, Search, Sliders } from "lucide-react";
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
  rating?: number;
}

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white shadow-md fixed top-0 left-0 p-5">
      <h2 className="text-lg font-bold mb-4">User Menu</h2>
      <nav className="mt-6">
        <div className="px-4">
          <div className="flex flex-col space-y-2">
            <a
              href="/dashboard"
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
            <a
              href="/upload"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Upload className="w-5 h-5 mr-3" />
              Upload Design
            </a>
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

const DesignCard: React.FC<Design> = ({
  designTitle,
  description,
  createdByName,
  rating,
  designInput,
}) => {
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
        <p className="text-yellow-500">
          Rating: {rating ? rating.toFixed(1) : "N/A"}
        </p>
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
          return (b.rating || 0) - (a.rating || 0);
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
                className="px-3"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Loading amazing designs...</p>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }`}
          >
            {filteredAndSortedDesigns.map((design) => (
              <div
                key={design._id}
                className={`transform transition-transform duration-200 hover:-translate-y-1 ${
                  viewMode === "list" ? "w-full" : ""
                }`}
              >
                <DesignCard
                  designId={design.designId}
                  designTitle={design.designTitle}
                  description={design.description}
                  createdByName={design.createdByName}
                  rating={design.rating}
                  designInput={design.designInput}
                  _id={design._id}
                  createdById={design.createdById}
                  createdAt={design.createdAt}
                  updatedAt={design.updatedAt}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredAndSortedDesigns.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">
              No designs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllDesigns;
