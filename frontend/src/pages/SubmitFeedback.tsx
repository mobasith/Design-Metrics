import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [feedback, setFeedback] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [showDesigns, setShowDesigns] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitting Feedback:", { designId, feedback, file });
    navigate("/analytics-dashboard");
  };

  const filteredDesigns = designs.filter((design) =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Submit Feedback</h1>

      {/* Back to Main Page Button */}
      <button
        onClick={() => navigate("/")} // Replace with your main page route
        className="mb-4 w-40 bg-gray-600 text-white rounded-md py-2 font-semibold hover:bg-gray-700 transition duration-200"
      >
        Back to Main Page
      </button>

      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            placeholder="Type to search..."
          />
        </div>

        {showDesigns && filteredDesigns.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor="designId"
              className="block text-sm font-medium text-gray-700"
            >
              Select Design
            </label>
            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
              {filteredDesigns.map((design) => (
                <li
                  key={design.id}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                  onClick={() => {
                    setDesignId(design.id);
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

        <div className="mb-4">
          <label
            htmlFor="designId"
            className="block text-sm font-medium text-gray-700"
          >
            Selected Design ID
          </label>
          <input
            type="number"
            id="designId"
            value={designId || ""}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Upload File (Excel, CSS, PDF)
          </label>
          <input
            type="file"
            id="file"
            accept=".xls,.xlsx,.css,.pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition duration-200"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default SubmitFeedback;
