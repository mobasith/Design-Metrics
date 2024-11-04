import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Heart, 
  Share2, 
  Download, 
  ChevronLeft
} from 'lucide-react';
import { 
  Card,
  CardContent,
} from "../components/ui/DashBoardCard";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

const DesignView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/designs/${id}`);
        setDesign(response.data);
      } catch (err) {
        console.error("Error fetching design:", err);
        setError("Failed to load design details");
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="link" onClick={() => window.history.back()}>
            <ChevronLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold ml-4">Design Detail</h1>
        </div>
      </div>

      {/* Design Detail Section */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div>Loading design details...</div>
        ) : error ? (
          <div>{error}</div>
        ) : design ? (
          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold">{design.designTitle}</h2>
              <img src={design.designInput} alt={design.designTitle} className="w-full h-64 object-cover my-4" />
              <p>{design.description}</p>
              <div className="flex justify-between mt-4">
                <div>
                  <span className="mr-4">
                    <Heart className="inline-block" /> 0 Likes
                  </span>
                  <span className="mr-4">
                    <Share2 className="inline-block" /> Share
                  </span>
                  <span className="mr-4">
                    <Download className="inline-block" /> Download
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>No design found</div>
        )}
      </div>
    </div>
  );
};

export default DesignView;
