import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

interface FeedbackFormData {
  design_id: number | null;
  description: string;
  file?: File | null;
}

const designs = [
  { id: 1, name: "Design 1" },
  { id: 2, name: "Design 2" },
  { id: 3, name: "Design 3" },
  { id: 4, name: "Design 4" },
  { id: 5, name: "Design 5" },
];

const SubmitFeedback: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [designId, setDesignId] = useState<number | null>(null);
  const [designName, setDesignName] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [showDesigns, setShowDesigns] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!file) {
      setError("Please select a file to upload");
      setIsSubmitting(false);
      return;
    }

    if (!feedback) {
      setError("Description is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', feedback);
      
      // Optionally add design_id if it's needed
      if (designId) {
        formData.append('design_id', designId.toString());
      }

      const response = await axios.post(
        `${API_BASE_URL}/feedback/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDesigns = designs.filter((design) =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
        Submit Feedback
      </h1>

      <button
        onClick={() => navigate("/")}
        className="mb-4 w-48 bg-indigo-600 text-white rounded-md py-2 font-semibold hover:bg-indigo-700 transition duration-200"
      >
        Back to Main Page
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-200 text-red-800 rounded-md shadow-md">
          {error}
        </div>
      )}

      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label
            htmlFor="search"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Search Design
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDesigns(true)}
            onBlur={() => setTimeout(() => setShowDesigns(false), 100)}
            className="mt-1 block w-full border-gray-300 border rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2"
            placeholder="Type to search..."
          />
        </div>

        {showDesigns && filteredDesigns.length > 0 && (
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Select Design
            </label>
            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
              {filteredDesigns.map((design) => (
                <li
                  key={design.id}
                  className="cursor-pointer hover:bg-gray-100 p-3 transition duration-200"
                  onClick={() => {
                    setDesignId(design.id);
                    setDesignName(design.name);
                    setSearchTerm("");
                    setShowDesigns(false);
                  }}
                >
                  {design.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="designId"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Selected Design
          </label>
          <input
            type="text"
            id="designId"
            value={designName}
            readOnly
            className="mt-1 block w-full border-gray-300 border rounded-md shadow-sm bg-gray-100 p-2"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="feedback"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Description (Required)
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 border rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="file"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Upload File (Excel, CSS, PDF) (Required)
          </label>
          <input
            type="file"
            id="file"
            accept=".xls,.xlsx,.css,.pdf"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full border-gray-300 border rounded-md shadow-sm focus:ring focus:ring-blue-500 p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-md py-2 font-semibold transition duration-200 ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default SubmitFeedback;