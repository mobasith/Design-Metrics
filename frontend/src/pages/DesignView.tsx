import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Share2, Download, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "../components/ui/DashBoardCard";
import { Button } from "../components/ui/button";

interface Design {
  _id: string;
  designId: number;
  designInput: string;
  designTitle: string;
  description: string;
  designerName: string; // New field
  creationDate: string; // New field
  category: string; // New field
  tags?: string[]; // New field with optional property
  // Add other properties as needed
}

const DesignView: React.FC = () => {
  const { designId } = useParams<{ designId: string }>();
  const navigate = useNavigate();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesign = async () => {
      if (!designId) {
        setError("Design ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Design>(
          `http://localhost:3002/api/designs/${designId}`
        );
        setDesign(response.data);
      } catch (err: any) {
        console.error("Error fetching design:", err);
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          // Request was made but no response received
          setError("Error: No response from server.");
        } else {
          // Something else happened
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [designId]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="flex justify-between items-center w-full p-4 bg-white shadow-md">
        <Button onClick={() => window.history.back()}>
          <ChevronLeft className="mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Design Detail</h2>
      </div>

      {/* Design Detail Section */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-500">
            Loading design details...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : design ? (
          <Card className="max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden">
            <CardContent>
              {/* Header with Designer Info */}
              <div className="flex items-center mb-4">
                {/* You can add an Avatar component here if needed */}
                <div>
                  <h3 className="text-2xl font-semibold">
                    {design.designTitle}
                  </h3>
                  <p className="text-gray-600">By {design.designerName}</p>
                  <p className="text-gray-500 text-sm">
                    Created on{" "}
                    {new Date(design.creationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Design Image */}
              <img
                src={design.designInput}
                alt={design.designTitle}
                className="w-full h-64 object-cover rounded-lg my-4"
              />

              {/* Description and Additional Details */}
              <p className="text-gray-700 mb-4">{design.description}</p>
              <p>
                <strong>Category:</strong> {design.category}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {design.tags?.join(", ") || "No tags available"}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Heart className="text-red-500" />
                  <span>Like</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Share2 />
                  <span>Share</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Download />
                  <span>Download</span>
                </Button>
              </div>

              {/* Redirect Button to Submit Feedback */}
              <div className="mt-6">
                <Button
                  onClick={() => navigate("/submit-feedback")}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-gray-500">No design found</div>
        )}
      </div>
    </div>
  );
};

export default DesignView;
