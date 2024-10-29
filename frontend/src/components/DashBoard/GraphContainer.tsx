import React from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataPoint {
  name: string; 
  [key: string]: string | number; 
}

interface GraphContainerProps {
  selectedColumns: string[];
  selectedGraph: string;
  data: DataPoint[];
}

const GraphContainer: React.FC<GraphContainerProps> = ({ selectedColumns, selectedGraph, data }) => {
  const renderGraph = () => {
    switch (selectedGraph) {
      case 'Bar':
        return (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Bar Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <Tooltip />
                <Legend />
                {selectedColumns.map((column) => (
                  <Bar key={column} dataKey={column} fill="#4A5568" />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'Pie':
        return (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Pie Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={data} dataKey={selectedColumns[0]} nameKey="name" fill="#4A5568" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'Line':
        return (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Line Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <Tooltip />
                <Legend />
                {selectedColumns.map((column) => (
                  <Line key={column} type="monotone" dataKey={column} stroke="#4A5568" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 grid gap-4">
      {selectedColumns.length > 0 ? renderGraph() : <p className="text-gray-600">Please select columns to display a graph.</p>}
    </div>
  );
};

export default GraphContainer;
