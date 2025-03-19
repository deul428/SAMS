import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const ExcelTable = ({ response }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  
  // 기존 JSON 데이터를 원하는 형식으로 변환하는 함수
  const transformJsonData = (data) => {
    return data.map((item) => ({
      '사업 일련 번호': item.biz_opp_id,
      '사업 복제 번호': item.detail_no,
      '본부': item.change_preparation_high_dept_name,
      '팀': item.change_preparation_dept_name,
      '담당자': item.user_name,
      '판품 번호': item.sale_item_no,
      '사업 (기회) 명': item.biz_opp_name,
      '최종 고객사': item.last_client_com2_name,
      '진행률': item.progress2_rate_name,
      '필달 여부': item.essential_achievement_tf,
      '계약 일자': item.contract_date,
      '매출 일자': item.sale_date,
      '매입 일자': item.purchase_date,
      '총 매출 금액': item.total_sale_amt,
      '매입 금액': item.purchase_amt,
      '매출 이익': item.sale_profit,
      '대표 사업 구분': item.delegate_sale_com_name,
      '대표 제조사명': item.delegate_biz_section_name,
      '제품명': item.product_name
    }));
  };

  useEffect(() => {
    if (response) {
      const formattedData = transformJsonData(response);
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
    <Button variant='warning' className='float-right mb-2 ms-2' onClick={handleExport}>엑셀 다운로드</Button>
  );
};

export default ExcelTable;