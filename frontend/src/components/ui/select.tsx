import React from 'react';

export const Select: React.FC<{ value: string; onValueChange: (value: string) => void; children: React.ReactNode }> = ({
  value,
  onValueChange,
  children,
}) => {
  return (
    <select value={value} onChange={(e) => onValueChange(e.target.value)} className="border rounded p-2">
      {children}
    </select>
  );
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);

export const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <option value="">{placeholder}</option>
);
