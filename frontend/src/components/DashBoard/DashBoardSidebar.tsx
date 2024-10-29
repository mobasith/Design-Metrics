// src/components/DashBoard/Sidebar.tsx
import React from "react";
import Select, { MultiValue } from "react-select";

interface SidebarProps {
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  columns: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedColumns,
  setSelectedColumns,
  columns,
}) => {
  const handleColumnChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedValues = newValue.map((option) => option.value);
    setSelectedColumns(selectedValues);
  };

  const columnOptions = columns.map((col) => ({ value: col, label: col }));

  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="font-semibold mb-2">Select Columns</h2>
      <Select
        options={columnOptions}
        isMulti
        onChange={handleColumnChange}
        className="mt-2"
      />
    </div>
  );
};

export default Sidebar;
