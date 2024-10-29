import React from 'react';

interface HeaderProps {
  setSelectedGraph: (graph: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setSelectedGraph }) => {
  return (
    <div className="bg-blue-600 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <select onChange={(e) => setSelectedGraph(e.target.value)} className="mt-2 bg-blue-700 border border-blue-800 rounded p-2">
        <option value="Bar">Bar Chart</option>
        <option value="Pie">Pie Chart</option>
        <option value="Line">Line Chart</option>
        {/* Add more options if needed */}
      </select>
    </div>
  );
};

export default Header;
