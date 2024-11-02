import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { 
  Bell, 
  TrendingUp, 
  Star, 
  Users, 
  Award,
  ChevronDown,
  Calendar
} from "lucide-react";

Chart.register(...registerables);

// Define the props interface for MetricCard
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  trend?: number | null; // Optional prop
}

const DesignerDashboard: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  const notifications = [
    { 
      id: 1, 
      message: "New design submission received", 
      time: "2 mins ago",
      type: "new"
    },
    { 
      id: 2, 
      message: "Your design has been approved", 
      time: "1 hour ago",
      type: "success"
    },
    { 
      id: 3, 
      message: "Feedback received on Design 2", 
      time: "3 hours ago",
      type: "feedback"
    },
  ];

  // Enhanced chart configurations
  const lineData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Performance Score",
        data: [65, 59, 80, 81, 56],
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgba(99, 102, 241, 1)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(99, 102, 241, 1)",
        pointBorderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["UI Design", "UX Design", "Graphic Design", "Web Design", "Logo Design", "Icon Design"],
    datasets: [
      {
        label: "Project Completion Rate",
        data: [92, 88, 85, 84, 90, 87],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Excellent", "Good", "Average"],
    datasets: [
      {
        data: [63, 28, 9],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const histogramData = {
    labels: ["0-2", "2-4", "4-6", "6-8", "8-10"],
    datasets: [
      {
        label: "Review Distribution",
        data: [5, 15, 35, 30, 15],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Maintain aspect ratio for better sizing
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxWidth: 10,
        usePointStyle: true,
        boxPadding: 3
      }
    }
  };

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend = null }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-500" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="flex">
      <div className="flex-1 min-h-screen bg-gray-50 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Designer Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, Sarah Anderson</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {}}
              >
                <Calendar className="h-4 w-4" />
                <span>{selectedPeriod}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <button
                className="relative p-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-indigo-500 text-white text-xs flex items-center justify-center rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs text-gray-500">Mark all as read</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'new' ? 'bg-blue-50 text-blue-500' :
                            notification.type === 'success' ? 'bg-green-50 text-green-500' :
                            'bg-purple-50 text-purple-500'
                          }`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Average Rating" 
            value="4.8" 
            icon={Star}
            trend={2.4}
          />
          <MetricCard 
            title="Total Reviews" 
            value="2,847" 
            icon={Users}
            trend={12.5}
          />
          <MetricCard 
            title="Project Score" 
            value="92%" 
            icon={Award}
            trend={-5.0}
          />
          <MetricCard 
            title="Design Submissions" 
            value="125" 
            icon={TrendingUp}
            trend={10.0}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
          <div className="relative h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
          <div className="relative h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
          <div className="relative h-64">
            <Bar data={histogramData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
