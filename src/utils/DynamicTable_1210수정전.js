import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { apiMethods } from './api'; // API 호출 메서드
import roots from './datas/Roots';
import { Table, Button } from 'react-bootstrap';
import '../styles/_table.scss'; // 위에서 작성한 CSS를 임포트
import BizOppHistory from '../components/BizOppHistory';

function DynamicTable({ v_componentName, propsData }) {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {console.log(showModal); setShowModal(true)};
  const closeModal = () => setShowModal(false);
  const [data, setData] = useState([]);

  const rootsData = roots[4].props;
 
  const [v_handlingHtml, setVHandlingHtml] = useState(null);
  const columns = React.useMemo(() => rootsData, [rootsData]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  useEffect(() => {
    switch (v_componentName) {
      case `bizOpp`: 
        if (propsData.length > 0) {
          setData(propsData[0]); 
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
        console.log(propsData);
        // propsData[0].map((e, index) => {
        //   console.log("==============================", propsData[0][index], propsData[0][index-1]);
        //   if (index !== 0) {
        //     if (propsData[0][index].e !== propsData[0][index-1]) {
        //       console.log(propsData[0][index].e);
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
        if (propsData[0].length > 1) {
          for (let i = 1; i < propsData[0].length; i++) {
            const prevObject = propsData[0][i - 1];
            const currentObject = propsData[0][i];
    
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
        if (propsData.length > 0) {
          setData(propsData[0]); 
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
      // console.log("======= props data =======\n", v_componentName, propsData, propsData[0]);
    }
  }, [v_componentName, propsData]);


  return (
    <div id='tableArea'>
      {v_handlingHtml}
      
      <BizOppHistory show={showModal} onHide={closeModal} />
    </div>
  );
}

export default DynamicTable;
