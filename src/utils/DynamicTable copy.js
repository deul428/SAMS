import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { apiMethods } from './api'; // API 호출 메서드
import roots from './datas/Roots';
import { Table, Button } from 'react-bootstrap';
import '../styles/_table.scss'; // 위에서 작성한 CSS를 임포트
import BizOppHistory from '../components/BizOppHistory';

function DynamicTable() {
  const [data, setData] = useState([]);
  const rootsData = roots[4].props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await apiMethods.get(roots[4].url);
        if (getData && Array.isArray(getData)) {
          const filterData = getData.filter(e => !e.STATUS);
          setData(filterData[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(() => rootsData, [rootsData]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <Table bordered hover responsive {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const { key, ...restProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={key} {...restProps}>
              {headerGroup.headers.map((column) => {
                const { key, ...restProps } = column.getHeaderProps();
                return (
                  <th key={key} {...restProps}>
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const { key, ...restProps } = row.getRowProps();
          return (
            <tr key={key} {...restProps}>
              {row.cells.map((cell, index) => {
                const { key, ...restProps } = cell.getCellProps({
                  className: 'table-cell', // CSS 클래스 추가
                });
                return (
                  <td key={key} {...restProps}>
                    {index === row.cells.length - 1
                      ? <Button size="sm" variant="light" onClick={console.log("click")}>이력</Button>
                      : cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default DynamicTable;
