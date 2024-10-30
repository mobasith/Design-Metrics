import {
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

interface GraphContainerProps {
  selectedColumns: string[];
  selectedGraph: string;
  data: any[]; // Adjust the type according to your data structure
}

const GraphContainer: React.FC<GraphContainerProps> = ({
  selectedColumns,
  selectedGraph,
  data,
}) => {
  const renderGraph = () => {
    switch (selectedGraph) {
      case "Bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Tooltip />
              <Legend />
              {selectedColumns.map((column) => (
                <Bar key={column} dataKey={column} fill="#4A5568" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "Pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey={selectedColumns[0]} // Ensure this is valid
                nameKey="name"
                fill="#4A5568"
                label // Optional: adds labels to the pie chart
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "Line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip />
              <Legend />
              {selectedColumns.map((column) => (
                <Line
                  key={column}
                  type="monotone"
                  dataKey={column}
                  stroke="#4A5568"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return <p>Please select a graph type and columns.</p>;
    }
  };

  return (
    <div className="p-4" style={{ width: "100%", height: "80vh" }}> {/* Set a responsive height */}
      {selectedColumns.length > 0 ? (
        renderGraph()
      ) : (
        <p>Select columns to display a graph.</p>
      )}
    </div>
  );
};

export default GraphContainer;
