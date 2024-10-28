import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Adjust the path if necessary
import DesignCard from "../components/DesignCard"; // Adjust the path if necessary

const designs = [
  {
    id: 1,
    title: "Design 1",
    description: "Description for Design 1",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-01-01",
    rating: 4,
  },
  {
    id: 2,
    title: "Design 2",
    description: "Description for Design 2",
    imageUrl: "/images/Hero.avif",
    username: "User2",
    date: "2024-02-01",
    rating: 5,
  },
  {
    id: 3,
    title: "Design 3",
    description: "Description for Design 3",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-03-01",
    rating: 3,
  },
  {
    id: 4,
    title: "Design 4",
    description: "Description for Design 3",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2023-03-01",
    rating: 3.5,
  },
  {
    id: 5,
    title: "Design 5",
    description: "Description for Design 3",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-03-01",
    rating: 5,
  },
  {
    id: 3,
    title: "Design 3",
    description: "Description for Design 3",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-03-01",
    rating: 3,
  },
  {
    id: 3,
    title: "Design 3",
    description: "Description for Design 3",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-03-01",
    rating: 3,
  },
  {
    id: 3,
    title: "Design 3",
    description: "Description for Design 3",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-03-01",
    rating: 3,
  },

  {
    id: 3,
    title: "Design 3",
    description: "Description for Design 3",
    imageUrl: "/images/Hero.avif",
    username: "User1",
    date: "2024-03-01",
    rating: 3,
  },
];

const AllDesigns: React.FC = () => {
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
                onClick={() => handleCardClick(design.id)}
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
