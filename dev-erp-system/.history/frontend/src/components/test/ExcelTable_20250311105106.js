import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import * as XLSX from 'xlsx';

const ExcelTable = ({ response }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  
  // 기존 JSON 데이터를 원하는 형식으로 변환하는 함수
  const transformJsonData = (data) => {
    return data.map((item) => ({
      '사업 (기회) 명': item.biz_opp_id, // key 이름 변경
      '세부 번호': item.detail_no,
      '사용자 ID': item.user_id,
      '사용자 이름': item.user_name,
      '부서명': item.change_preparation_dept_name,
      '클라이언트명': item.last_client_com2_name,
      '판매사명': item.sale_com2_name,
      '계약 날짜': item.contract_date,
      '진행 상태': item.progress2_rate_name,
      '판매 날짜': item.sale_date,
      '총 매출 금액': item.total_sale_amt,
      '이익 금액': item.sale_profit,
      '구매 금액': item.purchase_amt,
      '제품명': item.product_name
      // 필요 없는 키는 포함하지 않음
    }));
  };

  useEffect(() => {
    if (response) {
      const formattedData = transformJsonData(response);
      console.log(response);
      setTableData(formattedData);
      setColumns(Object.keys(formattedData[0] || {}));
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
    XLSX.writeFile(workbook, `사업기회_${moment().format('YYYY-MM-DD')}.xlsx`);
  };
  return (
    <button onClick={handleExport} style={{ marginBottom: '20px' }}>
      Export to Excel
    </button>
  );
};

export default ExcelTable;