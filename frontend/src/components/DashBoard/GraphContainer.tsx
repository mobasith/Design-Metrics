import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface GraphContainerProps {
  selectedColumns: string[];
  selectedGraph: string;
  data: DataPoint[];
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
          <ResponsiveContainer width="100%" height={300}>
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey={selectedColumns[0]}
                nameKey="name"
                fill="#4A5568"
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case "Line":
        return (
          <ResponsiveContainer width="100%" height={300}>
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
    <div className="p-4">
      {selectedColumns.length > 0 ? (
        renderGraph()
      ) : (
        <p>Select columns to display a graph.</p>
      )}
    </div>
  );
};

export default GraphContainer;
