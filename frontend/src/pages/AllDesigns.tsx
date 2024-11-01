import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import DesignCard from "../components/DesignCard";

const initialDesigns = [
  { id: 1, title: "Design 1", description: "Description for Design 1", imageUrl: "/images/Hero.avif", username: "User1", date: "2024-01-01", rating: 4, likes: 5, dislikes: 0 },
  { id: 2, title: "Design 2", description: "Description for Design 2", imageUrl: "/images/Hero.avif", username: "User2", date: "2024-02-01", rating: 5, likes: 10, dislikes: 0 },
  { id: 3, title: "Design 3", description: "Description for Design 3", imageUrl: "/images/Hero.avif", username: "User3", date: "2024-03-01", rating: 3, likes: 3, dislikes: 1 },

];

const AllDesigns: React.FC = () => {
  const [designs, setDesigns] = useState(initialDesigns);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>(""); 
  const [ratingFilter, setRatingFilter] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const designsPerPage = 9;

  const latestDesigns = useMemo(() => designs.slice(0, 3), [designs]);
  const bestDesigns = useMemo(() => [...designs].sort((a, b) => b.rating - a.rating).slice(0, 3), [designs]);

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.id.toString().includes(searchTerm);
    const matchesDate = dateFilter ? design.date === dateFilter : true;
    const matchesRating = ratingFilter ? design.rating === ratingFilter : true;
    return matchesSearch && matchesDate && matchesRating;
  });

  const indexOfLastDesign = currentPage * designsPerPage;
  const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
  const currentDesigns = filteredDesigns.slice(indexOfFirstDesign, indexOfLastDesign);
  const totalPages = Math.ceil(filteredDesigns.length / designsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const onLike = (id: number) => {
    setDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
        design.id === id ? { ...design, likes: design.likes + 1 } : design
      )
    );
  };

  const onDislike = (id: number) => {
    setDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
        design.id === id ? { ...design, dislikes: design.dislikes + 1 } : design
      )
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 fixed top-0 left-0 h-full bg-gray-800 text-white">
        <Sidebar name="Chaitanya Katore" profileImage="/images/user.png" />
      </div>
      <div className="ml-64 flex-grow">
        <section className="p-8">
          <h1 className="text-center text-4xl font-bold mb-8">All Designs</h1>

          {/* Search and Filter Options */}
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
              {Array.from(new Set(designs.map((d) => d.date))).map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value) || "")}
              className="border-gray-300 rounded-md p-2 shadow focus:ring focus:ring-blue-500"
            >
              <option value="">Filter by Rating</option>
              {Array.from(new Set(designs.map((d) => d.rating))).map((rating) => (
                <option key={rating} value={rating}>{rating}</option>
              ))}
            </select>
          </div>

          {/* Latest Designs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Latest Designs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  id={design.id}
                  title={design.title}
                  description={design.description}
                  imageUrl={design.imageUrl}
                  likes={design.likes}
                  dislikes={design.dislikes}
                  onClick={() => alert(`Viewing ${design.title}`)}
                  onLike={onLike}
                  onDislike={onDislike}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 mx-1 rounded-md ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* No Designs Message */}
          {currentDesigns.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No designs match your criteria.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AllDesigns;
