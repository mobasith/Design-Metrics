// src/components/DashBoard/Header.tsx
import React from "react";

interface HeaderProps {
  setSelectedGraph: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ setSelectedGraph }) => {
  const chartTypes = [
    { value: "bar", label: "Bar Chart" },
    { value: "line", label: "Line Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "scatter", label: "Scatter Plot" },
    { value: "doughnut", label: "Doughnut Chart" },
  ];

  return (
    <div className="bg-white shadow p-4 flex justify-around">
      {chartTypes.map((chart) => (
        <button
          key={chart.value}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setSelectedGraph(chart.value)}
        >
          {chart.label}
        </button>
      ))}
    </div>
  );
};

export default Header;
