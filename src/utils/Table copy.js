import { useTable } from 'react-table';
import { apiMethods } from './api';
import React, { useState, useEffect } from 'react';
function calculateRowSpan(data, key) {
  if (!data || !key) return [];
  const spanArray = Array(data.length).fill(0);
  let count = 1;

  for (let i = 1; i <= data.length; i++) {
    if (i === data.length || data[i][key] !== data[i - 1][key]) {
      spanArray[i - count] = count;
      count = 1;
    } else {
      count++;
    }
  }

  return spanArray;
}



function MyTable({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const 본부RowSpans = calculateRowSpan(data, '사업 (기회) ID');

  const tableStyle = {
    border: '1px solid black',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  };
  
  const cellStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };
  
  
  return (
    <table {...getTableProps()} style={tableStyle}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={cellStyle}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {본부RowSpans[index] > 0 && (
                <td rowSpan={본부RowSpans[index]} style={cellStyle}>
                  {row.original['사업 (기회) ID']}
                </td>
              )}
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} style={cellStyle}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>

    </table>
  );
  
}
function Data (){
  const [data, setData] = useState([]);
  const endpoint = `api/biz-opp/`;

  useEffect(() => {
    const f_handlingData = async () => {
      try {
        const getData = await apiMethods.get(endpoint);
        if (getData && getData.length > 0) {
          setData(getData);
        }
        console.log(getData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    f_handlingData();
  }, []);
  // console.log({apiMethods});
 
  // const data = [
  //   { 본부: '델사업본부', 팀: '영업1팀', 담당자: '정윤재', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업1팀', 담당자: '정윤재', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업1팀', 담당자: '정윤재', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업2팀', 담당자: '홍길동', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업3팀', 담당자: '홍길동', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업3팀', 담당자: '홍길동', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업4팀', 담당자: '바둑이', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업4팀', 담당자: '바둑이', 매출: '20,000', 매출이익: '20,000' },
  //   { 본부: '델사업본부', 팀: '영업4팀', 담당자: '바둑이', 매출: '20,000', 매출이익: '20,000' },
  // ];

  // const data = f_handlingData();
  const columns = React.useMemo(
    () => [
      { Header: '사업 (기회) ID', accessor: 'biz_opp_id' },
      { Header: '사업 (기회)명', accessor: 'biz_opp_name' },
      { Header: '사용자 ID', accessor: 'user_id' },
      { Header: '사용자 이름', accessor: 'user_name' },
      { Header: '변경 대비용 부서 ID', accessor: 'change_preparation_dept_id' },
      { Header: '변경 대비용 부서명', accessor: 'change_preparation_dept_name' },
      { Header: '최종 고객사1 code', accessor: 'last_client_com1_code' },
      { Header: '최종 고객사2 code', accessor: 'last_client_com2_code' },
      { Header: '최종 고객사1 이름', accessor: 'last_client_com1_name' },
      { Header: '최종 고객사2 이름', accessor: 'last_client_com2_name' },
      { Header: '매출처1 code', accessor: 'sale_com1_code' },
      { Header: '매출처2 code', accessor: 'sale_com2_code' },
      { Header: '매출처1 이름', accessor: 'sale_com1_name' },
      { Header: '매출처2 이름', accessor: 'sale_com2_name' },
      { Header: '계약 일자', accessor: 'contract_date' },
      { Header: '진행률1 code', accessor: 'progress1_rate' },
      { Header: '진행률2 code', accessor: 'progress2_rate' },
      { Header: '판품 번호', accessor: 'sale_item_no' },
      { Header: '매출 일자', accessor: 'sale_date' },
      { Header: '매출 금액', accessor: 'sale_amt' },
      { Header: '매출 이익', accessor: 'sale_profit' },
      { Header: '매입 일자', accessor: 'purchase_date' },
      { Header: '매입 금액', accessor: 'purchase_amt' },
      { Header: '사업 구분1 code', accessor: 'biz_section1_code' },
      { Header: '사업 구분2 code', accessor: 'biz_section2_code' },
      { Header: '필달 여부', accessor: 'essential_achievement_tf' },
      { Header: '제품1 code', accessor: 'product1_code' },
      { Header: '제품2 code', accessor: 'product2_code' },
      { Header: '제품1 이름', accessor: 'product1_name' },
      { Header: '제품2 이름', accessor: 'product2_name' },
      { Header: '등록자 ID', accessor: 'create_user' },
      { Header: '등록 일시', accessor: 'create_date' },
      { Header: '수정자 ID', accessor: 'update_user' },
      { Header: '수정 일시', accessor: 'update_date' },
      { Header: '삭제자 ID', accessor: 'delete_user' },
      { Header: '삭제 일시', accessor: 'delete_date' },
    ],
    []
  );
  

  return <MyTable columns={columns} data={data} />;
}

export default Data;
