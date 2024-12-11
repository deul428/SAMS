import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { apiMethods } from './api'; // API 호출 메서드
import roots from './datas/Roots';
import { Table, Button } from 'react-bootstrap';
import '../styles/_table.scss'; // 위에서 작성한 CSS를 임포트
import BizOppHistory from '../components/BizOppHistory';

function DynamicTable({ v_componentName, v_propsData }) {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {console.log(showModal); setShowModal(true)};
  const closeModal = () => setShowModal(false);

  const [data, setData] = useState([]);



  // 테이블 헤더 키 값 갖고 오기
  let rootsData = null;
  switch(v_componentName) {
    case `bizOpp`: 
      rootsData = roots[4].props;
      break;
    case `activity`: 
      rootsData = roots[4].props;
      break;
    default:
      rootsData = roots[4].props;
      break;
  }


  const [v_handlingHtml, setVHandlingHtml] = useState(null);

  const columns = React.useMemo(() => roots[4].props, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
  useEffect(() => {
    if (!v_propsData || v_propsData.length === 0 || !v_propsData[0][3]) {
      console.warn("v_propsData가 비어 있습니다.");
      return;
    }
    const updatedData = v_propsData[0][3];
    console.log("업데이트된 데이터:", updatedData);

    setData(updatedData); // 상태 업데이트
  }, [v_propsData]);

  useEffect(() => {
    console.log("data 상태가 업데이트되었습니다:", data);

    if (data.length > 0) {
      const htmlContent = (
        <>
          <BizOppHistory show={showModal} onHide={closeModal} />
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
                    {row.cells.map((cell, index) => (
                      <td {...cell.getCellProps()}>
                        {index === row.cells.length - 1 ? (
                          <Button size="sm" variant="light" onClick={() => setShowModal(true)}>
                            이력
                          </Button>
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      );
      setVHandlingHtml(htmlContent);
    }
  }, [data]);

  return <div id="tableArea">{v_handlingHtml}</div>;
}

export default DynamicTable;
