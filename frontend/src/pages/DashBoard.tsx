import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import { ChevronDown, BarChart2, TrendingUp, PieChart as PieChartIcon, Disc, ScatterChart as ScatterPlotIcon } from 'lucide-react';

type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'donut';

interface ArrayData {
  [key: string]: Array<string | number>;
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

const COLORS = [
  '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b',
  '#84cc16', '#ef4444', '#06b6d4', '#f97316', '#8b5cf6'
];

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6 border-b border-gray-100">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-900">{children}</h2>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6">{children}</div>
);

const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; icon?: JSX.Element }>;
  placeholder: string;
  icon?: JSX.Element;
}> = ({ value, onChange, options, placeholder, icon }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 appearance-none bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
      {icon}
    </div>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
  </div>
);

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
    const commonProps = {
      className: "mt-4"
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="value" fill="#6366f1" name={yAxis} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name={yAxis} 
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'pie':
      case 'donut':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chartType === 'donut' ? 80 : 0}
              outerRadius={140}
              label
              paddingAngle={2}
            >
              {processedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" name={xAxis} tick={{ fill: '#6b7280' }} />
            <YAxis dataKey="value" name={yAxis} tick={{ fill: '#6b7280' }} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Scatter 
              name={`${xAxis} vs ${yAxis}`} 
              data={processedData} 
              fill="#6366f1"
            />
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
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm mt-2">Please select different axes or check your data source</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
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
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: <BarChart2 size={18} /> },
    { value: 'line', label: 'Line Chart', icon: <TrendingUp size={18} /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChartIcon size={18} /> },
    { value: 'donut', label: 'Donut Chart', icon: <Disc size={18} /> },
    { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlotIcon size={18} /> }
  ];

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
          <div className="text-red-500 text-xl font-semibold mb-2">Error Loading Data</div>
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dynamic Data Visualization Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomSelect
                value={chartType}
                onChange={(value) => setChartType(value as ChartType)}
                options={chartTypes}
                placeholder="Select chart type"
                icon={<BarChart2 size={18} />}
              />
              <CustomSelect
                value={selectedXAxis}
                onChange={setSelectedXAxis}
                options={columns.map(col => ({ value: col, label: col }))}
                placeholder="Select X-Axis"
                icon={<ChevronDown size={18} />}
              />
              <CustomSelect
                value={selectedYAxis}
                onChange={setSelectedYAxis}
                options={columns.map(col => ({ value: col, label: col }))}
                placeholder="Select Y-Axis"
                icon={<ChevronDown size={18} />}
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
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-lg font-medium">No Chart Generated</p>
                  <p className="text-gray-400 mt-2">Please select both axes to generate a chart</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-6">
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Debug Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500">Available Columns</div>
                    <div className="font-medium mt-1">{columns.join(', ')}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500">Selected X-Axis</div>
                    <div className="font-medium mt-1">{selectedXAxis || 'None'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500">Selected Y-Axis</div>
                    <div className="font-medium mt-1">{selectedYAxis || 'None'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500">Chart Type</div>
                    <div className="font-medium mt-1">{chartType}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;