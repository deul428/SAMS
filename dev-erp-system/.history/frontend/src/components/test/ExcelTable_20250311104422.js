import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const handleExportToExcel = (tableData, columns) => {
  if (!tableData.length) return;

  // JSON 데이터 변환
  const jsonData = tableData.map((row, index) => {
    let rowData = { 'No': index + 1 }; // 첫 번째 컬럼 (번호)
    columns.forEach((col) => {
      rowData[col.accessor] = row[col.accessor] || ''; // 빈 값 처리
    });
    return rowData;
  });

  // 엑셀 변환
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'BizOpp Table');
  
  // 엑셀 파일 생성 및 다운로드
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'BizOpp-Table.xlsx');
};
