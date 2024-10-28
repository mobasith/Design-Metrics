import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { AiOutlineBell } from "react-icons/ai";

// Register all chart.js components
Chart.register(...registerables);

const DesignerDashboard: React.FC = () => {
  const notifications = [
    { id: 1, message: "New design submission received." },
    { id: 2, message: "Your design has been approved." },
    { id: 3, message: "Feedback received on Design 2." },
  ];

  const [showNotifications, setShowNotifications] = useState(false);

  // Sample performance data for the charts
  const lineData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Line Performance",
        data: [65, 59, 80, 81, 56],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const barData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Group A", "Group B", "Group C"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const histogramData = {
    labels: ["0-10", "10-20", "20-30", "30-40", "40-50"],
    datasets: [
      {
        label: "Histogram Data",
        data: [5, 10, 15, 20, 25],
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div className="flex">
      <Sidebar name="Designer Name" profileImage="/images/user.png" />

      <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Designer Dashboard
          </h1>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <AiOutlineBell className="text-gray-800 text-2xl" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                {notifications.length}
              </span>
            )}
            {showNotifications && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded shadow-lg p-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Notifications
                </h3>
                <ul className="space-y-2">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Average Design Rating</h3>
            <p className="text-2xl font-bold">4.5</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Total Ratings</h3>
            <p className="text-2xl font-bold">150</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold">Overall Score</h3>
            <p className="text-2xl font-bold">90</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Line Performance Graph
            </h2>
            <Line data={lineData} options={{ responsive: true }} />
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Bar Votes Graph
            </h2>
            <Bar data={barData} options={{ responsive: true }} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Pie Chart
            </h2>
            <Pie data={pieData} options={{ responsive: true }} />
          </div>

          {/* Histogram */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Histogram Data
            </h2>
            <Bar
              data={histogramData}
              options={{
                responsive: true,
                scales: { x: { type: "category" } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
