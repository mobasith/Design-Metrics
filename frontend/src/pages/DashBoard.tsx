import React, { useState } from 'react';
import Sidebar from '../components/DashBoard/DashBoardSidebar';
import Header from '../components/DashBoard/DashBoardHeader';
import GraphContainer from '../components/DashBoard/GraphContainer';

const sampleData = [
  { name: 'A', 'Column 1': 400, 'Column 2': 240, 'Column 3': 240, 'Column 4': 150 },
  { name: 'B', 'Column 1': 300, 'Column 2': 456, 'Column 3': 300, 'Column 4': 500 },
  { name: 'C', 'Column 1': 200, 'Column 2': 300, 'Column 3': 400, 'Column 4': 350 },
  { name: 'D', 'Column 1': 278, 'Column 2': 390, 'Column 3': 400, 'Column 4': 600 },
  { name: 'E', 'Column 1': 500, 'Column 2': 250, 'Column 3': 450, 'Column 4': 700 },
  { name: 'F', 'Column 1': 320, 'Column 2': 180, 'Column 3': 290, 'Column 4': 410 },
  { name: 'G', 'Column 1': 470, 'Column 2': 240, 'Column 3': 320, 'Column 4': 520 },
  { name: 'H', 'Column 1': 250, 'Column 2': 300, 'Column 3': 400, 'Column 4': 150 },
  { name: 'I', 'Column 1': 310, 'Column 2': 400, 'Column 3': 350, 'Column 4': 650 },
  { name: 'J', 'Column 1': 390, 'Column 2': 450, 'Column 3': 300, 'Column 4': 480 },
];

const Dashboard: React.FC = () => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<string>('Bar');

  return (
    <div className="flex h-screen">
      <Sidebar selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} />
      <div className="flex-1 flex flex-col">
        <Header setSelectedGraph={setSelectedGraph} />
        <GraphContainer selectedColumns={selectedColumns} selectedGraph={selectedGraph} data={sampleData} />
      </div>
    </div>
  );
};

export default Dashboard;
