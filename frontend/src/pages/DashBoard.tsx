import React, { useEffect, useState } from "react";
import axios from "axios";
import Select, { MultiValue } from "react-select";
import { Bar, Line, Pie, Scatter, Histogram } from "react-chartjs-2"; // Import Histogram if using a specific library; otherwise, use Bar for histogram-like visualization
import { Chart, registerables } from "chart.js";

// Register chart.js components
Chart.register(...registerables);

// Define a type for the feedback data
type FeedbackData = {
  id: string;
  [key: string]: any; // Allow for additional dynamic fields
};

// Sidebar Component
const Sidebar: React.FC<{
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  columns: string[];
}> = ({ selectedColumns, setSelectedColumns, columns }) => {
  const handleColumnChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedValues = newValue.map((option) => option.value);
    setSelectedColumns(selectedValues);
  };

  const columnOptions = columns.map((col) => ({ value: col, label: col }));

  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="font-semibold mb-2">Select Columns</h2>
      <Select
        options={columnOptions}
        isMulti
        onChange={handleColumnChange}
        className="mt-2"
      />
    </div>
  );
};

// Chart Component
const ChartContainer: React.FC<{
  selectedColumns: string[];
  data: FeedbackData[];
  chartType: string;
}> = ({ selectedColumns, data, chartType }) => {
  // Ensure at least one column is selected for the histogram
  if (selectedColumns.length === 0) {
    return <p>Please select at least one column to generate the chart.</p>;
  }

  const [xAxis] = selectedColumns;

  // Prepare data for the chart
  const labels = data.map((item) => item[xAxis]); // Use the first selected column for x-axis labels
  const values = data.map((item) => item[xAxis]); // For histogram, values will be from the same selected column

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: xAxis,
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
      x: {
        title: {
          display: true,
          text: xAxis,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          fontSize: 15,
        },
      },
    },
  };

  // Render different chart types based on selection
  const renderChart = () => {
    switch (chartType) {
      case "Bar":
        return <Bar data={chartData} height={400} options={chartOptions} />;
      case "Line":
        return <Line data={chartData} height={400} options={chartOptions} />;
      case "Pie":
        return (
          <Pie
            data={{
              labels: labels,
              datasets: [
                {
                  label: xAxis,
                  data: values,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                  ],
                },
              ],
            }}
            height={400}
            options={{
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    fontSize: 15,
                  },
                },
              },
            }}
          />
        );
      case "Scatter":
        return (
          <Scatter
            data={{
              datasets: [
                {
                  label: xAxis,
                  data: data.map((item) => ({
                    x: item[xAxis],
                    y: item[xAxis], // Assuming y-axis is the same for a scatter plot
                  })),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
            height={400}
            options={{
              scales: {
                x: {
                  title: {
                    display: true,
                    text: xAxis,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: xAxis,
                  },
                },
              },
            }}
          />
        );
      case "Histogram":
        return (
          <Bar
            data={{
              labels: values,
              datasets: [
                {
                  label: xAxis,
                  data: values,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 2,
                },
              ],
            }}
            height={400}
            options={{
              scales: {
                x: {
                  title: {
                    display: true,
                    text: xAxis,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Frequency',
                  },
                },
              },
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div style={{ maxWidth: "650px", width: "100%" }}>
        {renderChart()}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [backendData, setBackendData] = useState<FeedbackData[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<string>("Bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/feedback");
        if (response.data.length > 0) {
          setBackendData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dynamically derive column options from backend data
  const columnOptions = Object.keys(backendData[0] || {}).filter(
    (key) => key !== "_id" && key !== "__v"
  );

  // Chart type options
  const chartTypeOptions = [
    { value: "Bar", label: "Bar Chart" },
    { value: "Line", label: "Line Chart" },
    { value: "Pie", label: "Pie Chart" },
    { value: "Scatter", label: "Scatter Plot" },
    { value: "Histogram", label: "Histogram" }, // Added histogram option
  ];

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-xl">Dashboard</h1>
        <Select
          options={chartTypeOptions}
          value={chartTypeOptions.find(option => option.value === chartType)}
          onChange={(selectedOption) => setChartType(selectedOption?.value || "Bar")}
          className="w-1/3"
          placeholder="Select Chart Type"
        />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          columns={columnOptions}
        />
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ChartContainer
              selectedColumns={selectedColumns}
              data={backendData}
              chartType={chartType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
