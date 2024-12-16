import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { apiMethods } from '../../utils/api'; // API 호출 메서드
import roots from '../../utils/datas/Roots';
import { Table, Button } from 'react-bootstrap';
import '../styles/_table.scss'; // 위에서 작성한 CSS를 임포트
import BizOppHistory from '../BizOppHistory';

function DynamicTable({ v_componentName, v_propsData }) {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {console.log(showModal); setShowModal(true)};
  const closeModal = () => setShowModal(false);

  const [data, setData] = useState([]);

  const rootsData = roots[4].props;
 
  const [v_handlingHtml, setVHandlingHtml] = useState(null);






  
  const columns = React.useMemo(() => rootsData, [rootsData]);

  useEffect(() => {
    if (!v_propsData || v_propsData.length === 0 || !v_propsData[0][3]) {
      console.warn("v_propsData가 비어 있습니다. 데이터 확인 필요.");
      return;
    }
    
    const updatedData = v_propsData[0][3];
    console.log("업데이트된 데이터:", updatedData);
    setData(updatedData);
  }, [v_propsData]);
  
  const memoizedData = React.useMemo(() => data, [data]);
  
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: memoizedData,
    });
  
  useEffect(() => {
    console.log("data 상태가 업데이트되었습니다:", data);
  }, [data]);
  
  return (
    <div id="tableArea">
      {data.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <Table bordered hover responsive {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
  
}

export default DynamicTable;
