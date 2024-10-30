import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Adjust the path if necessary
import DesignCard from "../components/DesignCard"; // Adjust the path if necessary

const initialDesigns = [
  {
    id: 1,
    title: "Design 1",
    description: "Description for Design 1",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-01-01",
    rating: 4,
    likes: 0,
    dislikes: 0,
  },
  // ... other designs
];

const AllDesigns: React.FC = () => {
  const [designs, setDesigns] = useState(initialDesigns);
  const [userFeedback, setUserFeedback] = useState<{ [key: number]: { liked: boolean; disliked: boolean } }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const designsPerPage = 9; // Number of designs per page

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch =
      design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.id.toString().includes(searchTerm);

    const matchesDate = dateFilter ? design.date === dateFilter : true;
    const matchesRating = ratingFilter ? design.rating === ratingFilter : true;

    return matchesSearch && matchesDate && matchesRating;
  });

  const indexOfLastDesign = currentPage * designsPerPage;
  const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
  const currentDesigns = filteredDesigns.slice(
    indexOfFirstDesign,
    indexOfLastDesign
  );

  const totalPages = Math.ceil(filteredDesigns.length / designsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleCardClick = (id: number) => {
    console.log(`Design ${id} clicked`);
  };

  const handleLike = (id: number) => {
    // Check if the user has already liked the design
    const userAction = userFeedback[id];

    // Prevent liking if the user has already liked or disliked
    if (!userAction || (!userAction.liked && !userAction.disliked)) {
      setDesigns((prevDesigns) =>
        prevDesigns.map((design) =>
          design.id === id ? { ...design, likes: design.likes + 1 } : design
        )
      );

      // Update user feedback
      setUserFeedback((prev) => ({
        ...prev,
        [id]: { liked: true, disliked: false }, // Mark as liked
      }));
    }
  };

  const handleDislike = (id: number) => {
    // Check if the user has already disliked the design
    const userAction = userFeedback[id];

    // Prevent disliking if the user has already liked or disliked
    if (!userAction || (!userAction.liked && !userAction.disliked)) {
      setDesigns((prevDesigns) =>
        prevDesigns.map((design) =>
          design.id === id ? { ...design, dislikes: design.dislikes + 1 } : design
        )
      );

      // Update user feedback
      setUserFeedback((prev) => ({
        ...prev,
        [id]: { liked: false, disliked: true }, // Mark as disliked
      }));
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 fixed top-0 left-0 h-full bg-gray-800 text-white">
        <Sidebar name="Chaitanya Katore" profileImage="/images/user.png" />
      </div>

      <div className="ml-64 flex-grow">
        <section className="p-8">
          <h1 className="text-center text-4xl font-bold mb-8">All Designs</h1>

          <div className="flex justify-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-md p-2 shadow focus:ring focus:ring-blue-500"
              placeholder="Search by name, username, or ID..."
            />
          </div>

          <div className="flex justify-center mb-6 space-x-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border-gray-300 rounded-md p-2 shadow focus:ring focus:ring-blue-500"
            >
              <option value="">Filter by Date</option>
              <option value="2024-01-01">2024-01-01</option>
              <option value="2024-02-01">2024-02-01</option>
              <option value="2024-03-01">2024-03-01</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value) || "")}
              className="border-gray-300 rounded-md p-2 shadow focus:ring focus:ring-blue-500"
            >
              <option value="">Filter by Rating</option>
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDesigns.map((design) => (
              <DesignCard
                key={design.id}
                id={design.id}
                title={design.title}
                description={design.description}
                imageUrl={design.imageUrl}
                likes={design.likes}
                dislikes={design.dislikes}
                onClick={() => handleCardClick(design.id)}
                onLike={() => handleLike(design.id)}
                onDislike={() => handleDislike(design.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Previous
              </button>
              <span className="self-center">{`${currentPage} / ${totalPages}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AllDesigns;
