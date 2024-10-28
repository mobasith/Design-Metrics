import * as xlsx from 'xlsx';

export const parseExcel = (filePath: string) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    return data; // This should be an array of feedback objects
};
