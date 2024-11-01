import React from 'react';

interface HeaderProps {
  setSelectedGraph: (chartType: string) => void; // Prop to set selected chart type
}

const Header: React.FC<HeaderProps> = ({ setSelectedGraph }) => {
  return (
    <header className="p-4 bg-gray-800 text-white">
      <h1 className="text-xl">Dashboard</h1>
      <div className="flex space-x-4">
        {['Bar', 'Line', 'Pie'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedGraph(type)}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            {type} Chart
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
