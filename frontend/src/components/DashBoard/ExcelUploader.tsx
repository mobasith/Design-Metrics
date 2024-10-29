import React from "react";

interface ExcelUploaderProps {
  onFileUpload: (file: File) => void;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mt-2"
      />
    </div>
  );
};

export default ExcelUploader;
