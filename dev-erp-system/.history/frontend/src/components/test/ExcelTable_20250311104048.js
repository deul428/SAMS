import React, { useState } from 'react';
import { useEffect } from 'react';
import * as XLSX from 'xlsx';
const ExcelTable = ({ response }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (response) {
      setTableData(response);
      setColumns(Object.keys(response[0] || {}));
    } else {
      return;
    }
  }, [response]);

  // 엑셀 데이터로 변환 후 다운로드
  const handleExport = () => {
    if (!tableData.length) return;
    
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'business-opportunities.xlsx');
  };
  return (
    <div>
      <h1>Business Opportunities Table</h1>
      <button onClick={handleExport} style={{ marginBottom: '20px' }}>
        Export to Excel
      </button>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col}>{row[col] !== null ? row[col] : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelTable;