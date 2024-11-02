import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut, 
  Search, 
  Grid, 
  List,
  Filter,
  TrendingUp
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/DashBoardCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropDownMenu";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [latestDesigns, setLatestDesigns] = useState([
    {
      id: 1,
      title: "Modern Minimalist",
      description: "Clean lines and simple aesthetics define this modern approach",
      imageUrl: "/images/Hero.avif",
      likes: 245,
      dislikes: 12,
      category: "minimalist",
      views: 1200,
      created: "2024-03-15",
      featured: true
    },
    {
      id: 2,
      title: "Bold Typography",
      description: "Experimental typography with vibrant colors",
      imageUrl: "/images/Hero.avif",
      likes: 189,
      dislikes: 8,
      category: "typography",
      views: 890,
      created: "2024-03-14"
    },
    {
      id: 3,
      title: "Nature Inspired",
      description: "Organic shapes and natural color palettes",
      imageUrl: "/images/Hero.avif",
      likes: 312,
      dislikes: 15,
      category: "organic",
      views: 1500,
      created: "2024-03-13",
      featured: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Designs' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'typography', name: 'Typography' },
    { id: 'organic', name: 'Organic' }
  ];

  const handleLike = (id: number) => {
    setLatestDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design.id === id ? { ...design, likes: design.likes + 1 } : design
      )
    );
  };
  
  const handleDislike = (id: number) => {
    setLatestDesigns(prevDesigns =>
      prevDesigns.map(design =>
        design.id === id ? { ...design, dislikes: design.dislikes + 1 } : design
      )
    );
  };
  

  const filteredDesigns = latestDesigns
    .filter(design => 
      (selectedCategory === 'all' || design.category === selectedCategory) &&
      (design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       design.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <div className="fixed w-64 h-full bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <img
                src="/images/user.png"
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
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600">
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
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
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
      <div className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Designs</h1>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <h3 className="text-2xl font-bold text-gray-900">3,590</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Likes</p>
                  <h3 className="text-2xl font-bold text-gray-900">746</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Featured Designs</p>
                  <h3 className="text-2xl font-bold text-gray-900">2</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Designs Grid/List */}
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
          "space-y-4"
        }>
          {filteredDesigns.map(design => (
            <Card 
              key={design.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow ${design.featured ? 'ring-2 ring-blue-500' : ''}`}
            >
              <CardHeader className="p-0">
                <img
                  src={design.imageUrl}
                  alt={design.title}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{design.title}</CardTitle>
                  {design.featured && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{design.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(design.created).toLocaleDateString()}</span>
                  <span>{design.views.toLocaleString()} views</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-between">
                <button
                  onClick={() => handleLike(design.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                >
                  <Heart className="w-4 h-4" />
                  <span>{design.likes}</span>
                </button>
                <button
                  onClick={() => navigate(`/detaildesign/${design.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;