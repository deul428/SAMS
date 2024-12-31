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

  const rootsData = roots.bizopp.props;
 
  const [v_handlingHtml, setVHandlingHtml] = useState(null);
  const columns = React.useMemo(() => rootsData, [rootsData]);

  const memoizedData = React.useMemo(() => data, [data]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: memoizedData,
    });
    

  useEffect(() => {
    console.log("v_propsData: ====================\n", v_propsData);
    if (!v_propsData || v_propsData.length === 0 || !v_propsData[0][3]) {
      console.warn("v_propsData가 비어 있습니다. 데이터 확인 필요.");
      return;
    }
    const updatedData = v_propsData[0][3];
    console.log("업데이트된 데이터:", updatedData);
    setData(updatedData); 

    switch (v_componentName) {
      case `bizOpp`: 
        if (v_propsData.length > 0) {
          setVHandlingHtml (
            <>
            <BizOppHistory show={showModal} onHide={closeModal} />
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
                              <Button size="sm" variant="light" onClick={openModal}>이력</Button>
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
        }
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
        if (v_propsData[0][3].length > 0) {
          setData(v_propsData[0][3]); 
          console.log(data);
          setVHandlingHtml (
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
        }
        break;
      
      default:
        setVHandlingHtml(<h1>안녕하세요 DynamicTable.js 작업 중입니다.</h1>);
      // console.log("======= props data =======\n", v_componentName, v_propsData[0][3], v_propsData[0][3]);
    }
  }, [v_componentName, v_propsData]);


  useEffect(() => {
    console.log("data 상태가 업데이트되었습니다:", data);
  }, [data]); // 상태 변경 확인용

  return (
    <div id='tableArea'>
      {v_handlingHtml}
      
      <BizOppHistory show={showModal} onHide={closeModal} />
    </div>
  );
}

export default DynamicTable;
