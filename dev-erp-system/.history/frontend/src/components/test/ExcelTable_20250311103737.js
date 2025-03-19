import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelTable = (response) => {
  const [tableData, setTableData] = useState([]); // 테이블 데이터 상태 관리
  const [columns, setColumns] = useState([]); // 테이블의 열 상태 관리

  if (!response) {
    return;
  }
  console.log("response: ", response);
  // 엑셀 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }); // 빈 셀도 처리
      setTableData(response);
      setColumns(Object.keys(jsonData[0] || {})); // 첫 번째 행의 키를 열 이름으로 사용
    };

    reader.readAsBinaryString(file);
  };

  // 테이블 데이터를 엑셀 파일로 내보내기
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'table-data.xlsx'); // 다운로드 파일 이름 설정
  };

  // 테이블 데이터 수정 핸들러
  const handleCellChange = (rowIndex, columnKey, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][columnKey] = value;
    setTableData(updatedData);
  };

  return (
    <div>
      <h1>Excel Upload and Table</h1>
      <input
        type='file'
        accept='.xlsx, .xls'
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
      />
      <button onClick={handleExport} style={{ marginBottom: '20px' }}>
        Export to Excel
      </button>
      <table border='1' cellPadding='5' style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <td key={col}>
                  <input
                    type='text'
                    value={row[col]}
                    onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelTable;
