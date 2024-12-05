import React from 'react';
import { useTable } from 'react-table';

// 샘플 데이터의 셀 병합을 위한 rowSpan을 계산하는 함수
function calculateRowSpan(data, key) {
  const spanArray = new Array(data.length).fill(0);
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

  // '본부', '팀', '담당자', '매출', '매출이익'에 대한 rowSpan 계산
  const 본부RowSpans = calculateRowSpan(data, '본부');
  const 팀RowSpans = calculateRowSpan(data, '팀');
  const 담당자RowSpans = calculateRowSpan(data, '담당자');

  return (
    <table {...getTableProps()} style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={{ border: '1px solid black', padding: '8px' }}>
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
              {/* 본부 셀 병합 */}
              {본부RowSpans[index] > 0 && (
                <td rowSpan={본부RowSpans[index]} style={{ border: '1px solid black', padding: '8px' }}>
                  {row.original.본부}
                </td>
              )}

              {/* 팀 셀 병합 */}
              {팀RowSpans[index] > 0 && (
                <td rowSpan={팀RowSpans[index]} style={{ border: '1px solid black', padding: '8px' }}>
                  {row.original.팀}
                </td>
              )}

              {/* 담당자 셀 병합 */}
              {담당자RowSpans[index] > 0 && (
                <td rowSpan={담당자RowSpans[index]} style={{ border: '1px solid black', padding: '8px' }}>
                  {row.original.담당자}
                </td>
              )}

              {/* 기타 컬럼 렌더링 */}
              {row.cells
                .filter(cell => !['본부', '팀', '담당자'].includes(cell.column.id)) // 이미 렌더링된 셀을 제외
                .map(cell => (
                  <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '8px' }}>
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

function Data() {
  const data = [
    { 본부: '델사업본부', 팀: '영업1팀', 담당자: '정윤재', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업1팀', 담당자: '정윤재', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업1팀', 담당자: '정윤재', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업2팀', 담당자: '홍길동', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업3팀', 담당자: '홍길동', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업3팀', 담당자: '홍길동', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업4팀', 담당자: '바둑이', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업4팀', 담당자: '바둑이', 매출: '20,000', 매출이익: '20,000' },
    { 본부: '델사업본부', 팀: '영업4팀', 담당자: '바둑이', 매출: '20,000', 매출이익: '20,000' },
  ];

  const columns = React.useMemo(
    () => [
      { Header: '본부', accessor: '본부' },
      { Header: '팀', accessor: '팀' },
      { Header: '담당자', accessor: '담당자' },
      { Header: '매출', accessor: '매출' },
      { Header: '매출이익', accessor: '매출이익' },
    ],
    []
  );

  return <MyTable columns={columns} data={data} />;
}

export default Data;
