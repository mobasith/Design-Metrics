import React, { useEffect, useState } from "react";
import axios from "axios";
import GridLayout, { WidthProvider } from "react-grid-layout";
import { Bar, Line, Pie, Scatter, Doughnut } from "react-chartjs-2";
import Sidebar from "../components/DashBoard/DashBoardSidebar";
import Header from "../components/DashBoard/DashBoardHeader";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "scatter", label: "Scatter Plot" },
  { value: "doughnut", label: "Doughnut Chart" },
];

const Dashboard: React.FC = () => {
  const [backendData, setBackendData] = useState<any>({});
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedChartType, setSelectedChartType] = useState("bar");

  // Fetch data from the backend API
  useEffect(() => {
    axios
      .get<any>("https://jsonplaceholder.org/comments")
      .then((response: { data: any }) => setBackendData(response.data))
      .catch((error: unknown) => console.error("Error fetching data:", error));
  }, []);

  // Get dynamic column names from the backend data
  const columnOptions = Object.keys(backendData).filter((key) =>
    Array.isArray(backendData[key])
  );

  // Generate chart data based on user-selected columns
  const graphData = {
    labels: backendData[selectedColumns[0]] || [],
    datasets: [
      {
        label: selectedColumns.join(", "),
        data: backendData[selectedColumns[1]] || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for Column Selection */}
      <Sidebar
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        columns={columnOptions}
      />

      <div className="flex-1 flex flex-col">
        {/* Header for Chart Type Selection */}
        <Header setSelectedGraph={setSelectedChartType} />

        <div className="p-4">
          <ResponsiveGridLayout
            className="layout"
            cols={12}
            rowHeight={30}
            width={1200}
            isResizable
            isDraggable
          >
            <div key="graph" className="bg-white border rounded shadow-lg p-4">
              <h3 className="font-semibold mb-2">Dynamic Chart</h3>

              {selectedChartType === "bar" && <Bar data={graphData} />}
              {selectedChartType === "line" && <Line data={graphData} />}
              {selectedChartType === "pie" && <Pie data={graphData} />}
              {selectedChartType === "scatter" && <Scatter data={graphData} />}
              {selectedChartType === "doughnut" && (
                <Doughnut data={graphData} />
              )}
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
