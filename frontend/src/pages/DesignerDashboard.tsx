import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, LayoutGrid, Upload, Settings, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface Design {
  _id: string;
  designInput: string; // Ensure this is a valid path for the image
  designTitle: string;
  description: string;
  createdAt: string;
}

const DesignerDashboard = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    designTitle: string;
    description: string;
    designInput: File | null;
  }>({
    designTitle: '',
    description: '',
    designInput: null,
  });

  const CREATED_BY_ID = "123456";
  const CREATED_BY_NAME = "Sarah Anderson";

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3002/api/designs');
      setDesigns(response.data);
    } catch (err) {
      setError('Failed to fetch designs');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.designInput) {
        throw new Error('Please select a file');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('designInput', formData.designInput);
      formDataToSend.append('designTitle', formData.designTitle);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('createdById', CREATED_BY_ID);
      formDataToSend.append('createdByName', CREATED_BY_NAME);
      // Send designId as a number (or as a string if required)
      formDataToSend.append('designId', Date.now().toString());

      await axios.post('http://localhost:3002/api/designs', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchDesigns();
      setShowUploadModal(false);
      setFormData({ designTitle: '', description: '', designInput: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload design';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        designInput: files[0]
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Design Hub</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4">
            <div className="flex flex-col space-y-2">
              <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                <Layout className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <LayoutGrid className="w-5 h-5 mr-3" />
                My Designs
              </button>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Upload className="w-5 h-5 mr-3" />
                Upload Design
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
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

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">My Designs</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Upload New Design
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <Card key={design._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{design.designTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={design.designInput} // Ensure this is a valid image URL
                      alt={design.designTitle}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <p className="mt-4 text-gray-600">{design.description}</p>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    Created on {formatDate(design.createdAt)}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Design</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="designTitle" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="designTitle"
                  value={formData.designTitle}
                  onChange={(e) => setFormData({ ...formData, designTitle: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="designInput" className="block text-sm font-medium text-gray-700">Select Design File</label>
                <input
                  type="file"
                  id="designInput"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setShowUploadModal(false)} className="mr-2 text-gray-600">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700" disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DesignerDashboard;