import React from 'react';

interface SidebarProps {
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedColumns, setSelectedColumns }) => {
  const columns = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];

  const handleCheckboxChange = (column: string) => {
    setSelectedColumns((prev) => 
      prev.includes(column) 
        ? prev.filter((col) => col !== column) 
        : [...prev, column]
    );
  };

  return (
    <div className="bg-gray-800 text-white w-1/4 p-4">
      <h2 className="font-bold mb-4">Select Columns</h2>
      {columns.map((column) => (
        <div key={column} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={selectedColumns.includes(column)}
            onChange={() => handleCheckboxChange(column)}
            className="mr-2"
          />
          <label>{column}</label>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
