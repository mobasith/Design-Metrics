import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ArrowLeft, Download } from "lucide-react";

interface ArrayData {
  [key: string]: Array<string | number>;
}

interface ChartDataPoint {
  name: string | number;
  value: string | number;
}

const COLORS = [
  "#6366f1",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#84cc16",
];

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
    <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
    {children}
  </div>
);

const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-4 pr-8 py-2 appearance-none bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      size={18}
    />
  </div>
);

const ChartContainer: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => (
  <div className="w-full h-[300px]">
    <ResponsiveContainer>{children}</ResponsiveContainer>
  </div>
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ArrayData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string>("");
  const [selectedYAxis, setSelectedYAxis] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/feedback");
      const jsonData = await response.json();

      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const arrayData = jsonData[0];
        const availableColumns = Object.keys(arrayData).filter(
          (key) =>
            Array.isArray(arrayData[key]) && !["_id", "__v"].includes(key)
        );
        setData(arrayData);
        setColumns(availableColumns);

        if (availableColumns.length >= 2) {
          setSelectedXAxis(availableColumns[0]);
          setSelectedYAxis(availableColumns[1]);
        }
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Note: This is a placeholder - you'll need to implement actual PDF generation
    // using a library like jsPDF or html2pdf
    window.print();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const processData = (): ChartDataPoint[] => {
    if (!data || !data[selectedXAxis] || !data[selectedYAxis]) return [];
    return data[selectedXAxis].map((value, index) => ({
      name: value,
      value: data[selectedYAxis][index],
    }));
  };

  const processedData = processData();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">
            Error Loading Data
          </div>
          <div className="text-gray-600">{error}</div>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="text-gray-600" size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Download size={18} />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X-Axis Data
              </label>
              <CustomSelect
                value={selectedXAxis}
                onChange={setSelectedXAxis}
                options={columns}
                placeholder="Select X-Axis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y-Axis Data
              </label>
              <CustomSelect
                value={selectedYAxis}
                onChange={setSelectedYAxis}
                options={columns}
                placeholder="Select Y-Axis"
              />
            </div>
          </div>
        </div>

        {selectedXAxis && selectedYAxis && processedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Bar Chart">
              <ChartContainer>
                <BarChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </Card>

            <Card title="Line Chart">
              <ChartContainer>
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1" }}
                  />
                </LineChart>
              </ChartContainer>
            </Card>

            <Card title="Scatter Plot">
              <ChartContainer>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis dataKey="value" tick={{ fill: "#6b7280" }} />
                  <Tooltip />
                  <Scatter data={processedData} fill="#6366f1" />
                </ScatterChart>
              </ChartContainer>
            </Card>

            <Card title="Pie Chart">
              <ChartContainer>
                <PieChart>
                  <Pie
                    data={processedData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {processedData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </Card>

            <Card title="Donut Chart">
              <ChartContainer>
                <PieChart>
                  <Pie
                    data={processedData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label
                  >
                    {processedData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </Card>

            <Card title="Area Chart">
              <ChartContainer>
                <LineChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </Card>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">No Charts Generated</p>
              <p className="mt-2">Please select both axes to generate charts</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
