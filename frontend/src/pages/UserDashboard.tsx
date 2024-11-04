import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/DashBoardCard";

interface Design {
  category: string;
  _id: string; // Unique identifier
  designId: number; // Design ID
  designInput: string; // URL of the design image
  designTitle: string; // Title of the design
  description: string; // Description of the design
  createdById: number; // ID of the creator
  createdByName: string; // Name of the creator
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number; // Version key (optional)
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [latestDesigns, setLatestDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get<Design[]>('http://localhost:3002/api/designs');
        setLatestDesigns(response.data);
      } catch (err) {
        console.error("Error fetching designs:", err);
        setError("Failed to load designs");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const filteredDesigns = latestDesigns
    .filter(design => 
      (selectedCategory === 'all' || design.category === selectedCategory) &&
      (design.designTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
       design.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <nav className="mt-4">
            <ul>
              <li className="mb-2">
                <button onClick={() => navigate('/user-dashboard')} className="w-full text-left px-2 py-1 hover:bg-gray-200">User Dashboard</button>
              </li>
              <li className="mb-2">
                <button onClick={() => navigate('/submit-feedback')} className="w-full text-left px-2 py-1 hover:bg-gray-200">Submit Feedback</button>
              </li>
              <li className="mb-2">
                <button onClick={() => navigate('/all-designs')} className="w-full text-left px-2 py-1 hover:bg-gray-200">All Designs</button>
              </li>
              <li className="mb-2">
                <button onClick={() => navigate('/settings')} className="w-full text-left px-2 py-1 hover:bg-gray-200">Settings</button>
              </li>
              {/* Add more sidebar items as needed */}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header Section with Search, Filter, and View Options */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Search designs..." 
              className="border border-gray-300 rounded-lg p-2" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="border border-gray-300 rounded-lg p-2 ml-4"
            >
              <option value="all">All Categories</option>
              {/* Add categories as needed */}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="ml-4">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg hover:bg-blue-500`}>Grid View</button>
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg hover:bg-blue-500 ml-2`}>List View</button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div>Loading designs...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
            "space-y-4"
          }>
            {filteredDesigns.map(design => (
              <Card 
                key={design._id} 
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0">
                  <img
                    src={design.designInput}
                    alt={design.designTitle}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{design.designTitle}</CardTitle>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{design.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4 flex justify-between">
                  <button
                    onClick={() => navigate(`/detaildesign/${design.designId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
