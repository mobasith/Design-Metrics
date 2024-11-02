import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Download, 
  MessageSquare, 
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Tag,
  ChevronLeft
} from 'lucide-react';
import { 
  Card,
  CardContent,
} from "../components/ui/DashBoardCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tab";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

const DesignView = () => {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Mock data - In a real app, fetch this based on the id
  const design = {
    id,
    title: "Modern Minimalist Design",
    description: "A clean and modern design approach that emphasizes simplicity and functionality. This design combines subtle neutral tones with bold geometric shapes to create a balanced and sophisticated aesthetic.",
    imageUrl: "/images/Hero.avif",
    creator: {
      name: "Sarah Anderson",
      avatar: "/images/user.png",
      role: "Senior Designer",
    },
    stats: {
      likes: 1234,
      views: 5678,
      downloads: 234,
      comments: 89
    },
    created: "2024-03-15",
    category: "Minimalist",
    tags: ["modern", "minimal", "clean", "professional"],
    details: {
      dimensions: "1920x1080px",
      fileSize: "2.4 MB",
      fileFormat: "AI, PSD, SVG",
      license: "Commercial Use",
    }
  };

  const [comments] = useState([
    {
      id: 1,
      user: {
        name: "Mike Johnson",
        avatar: "/images/user.png",
      },
      content: "Love the minimalist approach! The color palette is perfectly balanced.",
      timestamp: "2 hours ago",
      likes: 12
    },
    {
      id: 2,
      user: {
        name: "Emma Wilson",
        avatar: "/images/user.png",
      },
      content: "The attention to detail in this design is remarkable. Would love to see more like this!",
      timestamp: "5 hours ago",
      likes: 8
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Design Title and Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{design.title}</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center space-x-4 mb-6">
                <Avatar>
                  <AvatarImage src={design.creator.avatar} />
                  <AvatarFallback>{design.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{design.creator.name}</p>
                  <p className="text-sm text-gray-500">{design.creator.role}</p>
                </div>
              </div>

              {/* Design Image */}
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={design.imageUrl} 
                  alt={design.title}
                  className="w-full h-auto"
                />
              </div>

              {/* Tabs Section */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-gray-600">{design.description}</p>
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {design.tags.map(tag => (
                            <span 
                              key={tag}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                          <p className="text-gray-600">{design.details.dimensions}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">File Size</h4>
                          <p className="text-gray-600">{design.details.fileSize}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">File Format</h4>
                          <p className="text-gray-600">{design.details.fileFormat}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">License</h4>
                          <p className="text-gray-600">{design.details.license}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comments" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      {/* Add Comment Input */}
                      <div className="mb-6">
                        <textarea
                          placeholder="Add a comment..."
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <Button className="mt-2">Post Comment</Button>
                      </div>
                      
                      {/* Comments List */}
                      <div className="space-y-4">
                        {comments.map(comment => (
                          <div key={comment.id} className="border-b pb-4">
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                <AvatarImage src={comment.user.avatar} />
                                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-gray-600 mt-1">{comment.content}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <button className="text-sm text-gray-500 hover:text-gray-700">
                                    <ThumbsUp className="w-4 h-4 inline mr-1" />
                                    {comment.likes}
                                  </button>
                                  <button className="text-sm text-gray-500 hover:text-gray-700">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats Card */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Eye className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">{design.stats.views}</p>
                    <p className="text-sm text-gray-500">Views</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Heart className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">{design.stats.likes}</p>
                    <p className="text-sm text-gray-500">Likes</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Download className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">{design.stats.downloads}</p>
                    <p className="text-sm text-gray-500">Downloads</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">{design.stats.comments}</p>
                    <p className="text-sm text-gray-500">Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download Design
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save Design'}
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{new Date(design.created).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{design.category}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignView;