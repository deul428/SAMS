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

  const [data, setData] = useState([ ]);



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
    console.log(v_propsData.data.retrieve_biz_opp);
    const filteredData = Object.fromEntries(
      Object.entries(v_propsData.data).filter(([key, value]) => key.includes("search"))
    );
    console.log("filteredData: ", filteredData);
    // if (!v_propsData || v_propsData.length === 0 || !v_propsData[0][key]) {
      // console.warn("v_propsData가 비어 있습니다.");
      // return;
    // }
    //  // v_propsData[0][1]이 객체이고, 그 안에 'retrieve_biz_opp'가 있는지 확인
    // if (v_propsData[0][3] && v_propsData[0][3][key]) {
    //   const updatedData = v_propsData[0][3][key];
    //   console.log("업데이트된 데이터:", updatedData);
    //   setData(updatedData); // 상태 업데이트
    // } else {
    //   console.warn("retrieve_biz_opp 키가 없습니다.");
    // }
    /* const updatedData = v_propsData[data][key];
    console.log("업데이트된 데이터:", updatedData);

    setData(updatedData); // 상태 업데이트 */
  }, [v_propsData]);

  useEffect(() => {
    if (data.length > 0) {
      let htmlContent = null;
      switch (v_componentName) {
        case `bizOpp`: 
          htmlContent = (
            <>
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
                        const { key, ...restProps } = cell.getCellProps({ className: 'table-cell' });
                        return (
                          <td key={key} {...restProps}>
                            {index === row.cells.length - 1
                              ? 
                              <Button size="sm" variant="light" onClick={() => setShowModal(true)}>
                                이력
                              </Button>

                              : 
                              cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </>
          )
          setVHandlingHtml (htmlContent);
          break;
        case `bizOppHistory`: 
          console.log(v_propsData[0][3]);
          // v_propsData[0][3].map((e, index) => {
          //   console.log("==============================", v_propsData[0][3][index], v_propsData[0][3][index-1]);
          //   if (index !== 0) {
          //     if (v_propsData[0][3][index].e !== v_propsData[0][3][index-1]) {
          //       console.log(v_propsData[0][3][index].e);
          //     }
          //     // e.map((key, index) => {
          //       /* if (e[index].key === e[index-1].key) {
          //         console.log(e.key);
          //       } */
          //       // }
          //       // return e.key;
          //     // })
          //   }
          //   return e;
          // })
          if (v_propsData[0][3].length > 1) {
            for (let i = 1; i < v_propsData[0][3].length; i++) {
              const prevObject = v_propsData[0][3][i - 1];
              const currentObject = v_propsData[0][3][i];
      
              Object.keys(currentObject).forEach((key) => {
                if (prevObject[key] !== currentObject[key]) {
                  console.log(
                    `Index ${i - 1} -> ${i}: Key "${key}" changed from "${prevObject[key]}" to "${currentObject[key]}"`
                  );
                }
              });
            }
          }
          setVHandlingHtml(<h1>{v_componentName} Area</h1>);
          break;
        case `activity`: 
          console.log(data);
          htmlContent = (
            <>
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
                        const { key, ...restProps } = cell.getCellProps({ className: 'table-cell' });
                        return (
                          <td key={key} {...restProps}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </>
          )
          setVHandlingHtml (htmlContent);
          break;
        default:
          setVHandlingHtml(<h1>안녕하세요 DynamicTable.js 작업 중입니다.</h1>);
      }
    }
    
  }, [v_componentName, data]);

  return <div id="tableArea">
    {v_handlingHtml}
    <BizOppHistory show={showModal} onHide={closeModal} />
    </div>;
}

export default DynamicTable;
