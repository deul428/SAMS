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

  // const [v_dynamicTableData, setVDynamicTableData] = useState(null);
  const rootsData = roots[4].props;
 
  // console.log("+++++++++++++++++++++++++++++++ ", v_propsData);

  const [v_handlingHtml, setVHandlingHtml] = useState(null);
  const columns = React.useMemo(() => rootsData, [rootsData]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data
    });

  const [v_dynamicTableData, setVDynamicTableData] = useState(null);
  // 데이터 로드 감지
 /*  useEffect(() => {
    var v_dynamicTableData = null;
    if (v_propsData.length>0) { 
      console.log(v_propsData);
      setVDynamicTableData(v_propsData[0][3]);
    } else {
      setVDynamicTableData('아직 데이터가 없어요');
      return;
    }
    // return v_dynamicTableData;
  }, [v_propsData]); // v_propsData의 변경만 감지 */
/*   useEffect(() => {
    if (Array.isArray(v_propsData) && v_propsData.length > 0) {
      if (v_componentName === 'bizOpp') {
        const foundData = v_propsData[0].find(subArray =>
          subArray.some(item => item.hasOwnProperty('biz_opp_id'))
        );
        setVDynamicTableData(foundData || []);
      } else {
        const defaultData = v_propsData[0][3];
        setVDynamicTableData(defaultData);
      }
    } else if (v_propsData === null || v_propsData.length <= 0) {
      console.log("비었다", v_propsData.length);
      return;
    }
}, [v_propsData]); // 깊은 비교를 위해 JSON.stringify 사용 */

console.log("v_dynamicTableData: ", v_dynamicTableData);


  useEffect(() => {
/*     if (v_propsData.length>0) { 
      console.log("v_propsData: ", v_propsData, "v_propsData.length: ", v_propsData.length);
      setVDynamicTableData(v_propsData[0][3]);
    } else {
      setVDynamicTableData('아직 데이터가 없어요');
    }
    console.log("v_dynamicTableData: ", v_dynamicTableData); */
    switch (v_componentName) {
      case `bizOpp`: 
        if (v_propsData[0]) {
          setData(v_propsData[0][3]); 
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
        // console.log(v_dynamicTableData);
        // v_dynamicTableData.map((e, index) => {
        //   console.log("==============================", v_dynamicTableData[index], v_dynamicTableData[index-1]);
        //   if (index !== 0) {
        //     if (v_dynamicTableData[index].e !== v_dynamicTableData[index-1]) {
        //       console.log(v_dynamicTableData[index].e);
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
        /* if (v_dynamicTableData.length > 1) {
          for (let i = 1; i < v_dynamicTableData.length; i++) {
            const prevObject = v_dynamicTableData[i - 1];
            const currentObject = v_dynamicTableData[i];
    
            Object.keys(currentObject).forEach((key) => {
              if (prevObject[key] !== currentObject[key]) {
                console.log(
                  `Index ${i - 1} -> ${i}: Key "${key}" changed from "${prevObject[key]}" to "${currentObject[key]}"`
                );
              }
            });
          }
        } */
        setVHandlingHtml(<h1>{v_componentName} Area</h1>);
        break;
      case `activity`: 
        if (v_dynamicTableData.length > 0) {
          setData(v_dynamicTableData); 
          // console.log(data);
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
      // console.log("======= props data =======\n", v_componentName, v_propsData, v_dynamicTableData);
    }
  }, [v_propsData]);
  
  // return (
  //     <div id='tableArea'>
  //       {v_handlingHtml}
    
  //   {/* get 3번 호출 중 1개는 이거 */}
  //       {/* <BizOppHistory show={showModal} onHide={closeModal} /> */}
  //     </div>
  //   );
  return (
    <div id='tableArea'>
      {v_handlingHtml}
      
      {/* <BizOppHistory show={showModal} onHide={closeModal} /> */}
    </div>
  );
}

export default DynamicTable;
