import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart as RechartsePie, Pie, Cell } from 'recharts';

// Define interfaces for the data structure
interface ChartDataPoint {
  label: string;
  value: number;
}

interface UnitsCharts {
  pieChart: ChartDataPoint[];
  donutChart: ChartDataPoint[];
}

interface UnitsData {
  data: number[];
  charts: UnitsCharts;
}

interface ProcessedData {
  Units: UnitsData;
}

interface OverallInsights {
  summary: string;
  keyTakeaways: string[];
}

interface AnalyticsData {
  processedData: ProcessedData;
  overallInsights: OverallInsights;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userId = "1730789395576"; // This should be dynamic based on your auth system
        console.log('Fetching data for user:', userId);

        const response = await fetch(`http://localhost:3003/api/analytics/user/${userId}`);
        console.log('Response status:', response.status);

        if (!response.ok) throw new Error('Failed to fetch analytics');

        const data = await response.json();
        console.log('Received data:', data);

        if (!data || data.length === 0) {
          throw new Error('No data received');
        }

        setAnalyticsData(data[0]);
      } catch (err) {
        console.error('Error in fetchAnalytics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!analyticsData || !analyticsData.processedData || !analyticsData.processedData.Units) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No valid analytics data available</p>
      </div>
    );
  }

  const { processedData, overallInsights } = analyticsData;
  const { Units } = processedData;
  const { data: unitsData, charts: unitsCharts } = Units || {};

  return (
    <div id="analytics-dashboard" className="p-6 space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="text-sm text-gray-500">
          Data available: {unitsData?.length > 0 ? 'Yes' : 'No'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {overallInsights?.summary || 'No summary available'}
            </p>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Key Takeaways:</h4>
              <ul className="list-disc pl-4 space-y-1">
                {(overallInsights?.keyTakeaways || []).map((takeaway: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">{takeaway}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Units Over Time Chart */}
        {unitsData?.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Units Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart width={500} height={300} data={unitsData.map((value: number, index: number) => ({ name: `Entry ${index + 1}`, value }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <p className="text-center text-gray-500">No units data available</p>
            </CardContent>
          </Card>
        )}

        {/* Pie Chart */}
        {unitsCharts?.pieChart?.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Units Distribution (Pie)</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <RechartsePie width={300} height={300}>
                <Pie
                  data={unitsCharts.pieChart}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {unitsCharts.pieChart.map((entry: ChartDataPoint, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsePie>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <p className="text-center text-gray-500">No pie chart data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;