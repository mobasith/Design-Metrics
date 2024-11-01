import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';

// Types
type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'donut';

interface ArrayData {
  [key: string]: Array<string | number>;
//   _id?: string;
//   __v?: number;
}

interface ChartDataPoint {
  name: string | number;
  value: string | number;
}

interface ChartProps {
  data: ArrayData;
  xAxis: string;
  yAxis: string;
  chartType: ChartType;
}

// Simplified Card Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`border rounded-lg shadow-lg bg-white ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4 border-b">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4">{children}</div>
);

// Select Component
const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000',
  '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'
];

const DynamicChart: React.FC<ChartProps> = ({ data, xAxis, yAxis, chartType }) => {
  const processData = (): ChartDataPoint[] => {
    if (!data || !data[xAxis] || !data[yAxis]) return [];

    return data[xAxis].map((value, index) => ({
      name: value,
      value: data[yAxis][index]
    }));
  };

  const processedData = processData();

  const renderChart = (): JSX.Element => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name={yAxis} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name={yAxis} stroke="#8884d8" />
          </LineChart>
        );

      case 'pie':
      case 'donut':
        return (
          <PieChart>
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chartType === 'donut' ? 60 : 0}
              outerRadius={100}
              label
            >
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" name={xAxis} />
            <YAxis dataKey="value" name={yAxis} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name={`${xAxis} vs ${yAxis}`} data={processedData} fill="#8884d8" />
          </ScatterChart>
        );

      default:
        return (
          <div className="flex h-64 items-center justify-center text-gray-500">
            Invalid chart type selected
          </div>
        );
    }
  };

  if (!processedData.length) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No data available for the selected axes
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ArrayData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string>('');
  const [selectedYAxis, setSelectedYAxis] = useState<string>('');
  const [chartType, setChartType] = useState<ChartType>('bar');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/feedback');
      const jsonData: ArrayData[] = await response.json();
      console.log('Received data:', jsonData);

      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const arrayData = jsonData[0];
        
        const availableColumns = Object.keys(arrayData).filter(key => 
          Array.isArray(arrayData[key]) && !['_id', '__v'].includes(key)
        );

        setData(arrayData);
        setColumns(availableColumns);
        
        if (availableColumns.length >= 2) {
          setSelectedXAxis(availableColumns[0]);
          setSelectedYAxis(availableColumns[1]);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'donut', label: 'Donut Chart' },
    { value: 'scatter', label: 'Scatter Plot' }
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Dynamic Data Visualization Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CustomSelect
              value={chartType}
              onChange={(value) => setChartType(value as ChartType)}
              options={chartTypes}
              placeholder="Select chart type"
            />
            <CustomSelect
              value={selectedXAxis}
              onChange={setSelectedXAxis}
              options={columns.map(col => ({ value: col, label: col }))}
              placeholder="Select X-Axis"
            />
            <CustomSelect
              value={selectedYAxis}
              onChange={setSelectedYAxis}
              options={columns.map(col => ({ value: col, label: col }))}
              placeholder="Select Y-Axis"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {Object.keys(data).length > 0 && selectedXAxis && selectedYAxis ? (
            <DynamicChart
              data={data}
              xAxis={selectedXAxis}
              yAxis={selectedYAxis}
              chartType={chartType}
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              Please select both axes to generate a chart
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card className="mt-4">
        <CardContent>
          <h3 className="font-bold mb-2">Debug Information:</h3>
          <div className="space-y-1 text-sm">
            <p>Available Columns: {columns.join(', ')}</p>
            <p>Selected X-Axis: {selectedXAxis}</p>
            <p>Selected Y-Axis: {selectedYAxis}</p>
            <p>Chart Type: {chartType}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;