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

  const rootsData = roots[4].props;
 
  // console.log("+++++++++++++++++++++++++++++++ ", v_propsData);

  const [v_handlingHtml, setVHandlingHtml] = useState(null);
  const columns = React.useMemo(() => rootsData, [rootsData]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

/*     const [v_dynamicTableData, setVDynamicTableData] = useState([]);
    // 데이터 로드 감지
    useEffect(() => {
      if (v_propsData && Array.isArray(v_propsData) && Array.isArray(v_propsData[0])) {
        if (v_componentName === 'bizOpp') {
          // 'biz_opp_id'를 가진 배열 찾기
          const foundData = v_propsData[0].find(subArray =>
            subArray.some(item => item.hasOwnProperty('biz_opp_id'))
          );
          // console.log("찾은 데이터:", foundData);
          setVDynamicTableData(foundData || []); // 데이터 상태 설정
        } else {
          const defaultData = v_propsData[0][3];
          // console.log("+++++++++++++++++++++++++++++++++++++", defaultData);
          setVDynamicTableData(defaultData);
        }
      }
      // console.log(v_dynamicTableData);
    }, [v_propsData]); // v_propsData 변경 시 실행
 */

   // 상태 초기화
   const [v_dynamicTableData, setVDynamicTableData] = useState(
    v_propsData?.[0]?.[3] || null
  );

  // 부모로부터 새로운 props가 전달될 때 상태를 업데이트
  if (
    v_propsData &&
    v_propsData.length > 0 &&
    v_dynamicTableData !== v_propsData[0][3]
  ) {
    setVDynamicTableData(v_propsData[0][3]);
  }

  // 데이터가 로드되지 않았을 경우 로딩 메시지 표시
  if (!v_dynamicTableData) {
    return <div>Loading...</div>;
  }

  // 데이터 렌더링
  return <div>
     {v_dynamicTableData.map((item) => (
      <div key={item.biz_opp_id}>
        <p>Biz Opp ID: {item.biz_opp_id}</p>
        <p>Biz Opp Name: {item.biz_opp_name}</p>
        <p>Sale Amount: {item.sale_amt}</p>
      </div>
    ))}
    
    </div>;
}
    
//   switch (v_componentName) {
//     case `bizOpp`: 
//       if (v_dynamicTableData.length > 0) {
//         setData(v_dynamicTableData); 
//         setVHandlingHtml (
//           <>
//           <BizOppHistory show={showModal} onHide={closeModal} />
//           <Table bordered hover responsive {...getTableProps()}>
//             <thead>
//               {headerGroups.map((headerGroup) => {
//                 const { key, ...restProps } = headerGroup.getHeaderGroupProps();
//                 return (
//                   <tr key={key} {...restProps}>
//                     {headerGroup.headers.map((column) => {
//                       const { key, ...restProps } = column.getHeaderProps();
//                       return (
//                         <th key={key} {...restProps}>
//                           {column.render('Header')}
//                         </th>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {rows.map((row) => {
//                 prepareRow(row);
//                 const { key, ...restProps } = row.getRowProps();
//                 return (
//                   <tr key={key} {...restProps}>
//                     {row.cells.map((cell, index) => {
//                       const { key, ...restProps } = cell.getCellProps({ className: 'table-cell' });
//                       return (
//                         <td key={key} {...restProps}>
//                           {index === row.cells.length - 1
//                             ? 
//                             <Button size="sm" variant="light" onClick={openModal}>이력</Button>
//                             : 
//                             cell.render('Cell')}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//           </>
//         )
//       }
//       break;
//     case `bizOppHistory`: 
//       // console.log(v_dynamicTableData);
//       // v_dynamicTableData.map((e, index) => {
//       //   console.log("==============================", v_dynamicTableData[index], v_dynamicTableData[index-1]);
//       //   if (index !== 0) {
//       //     if (v_dynamicTableData[index].e !== v_dynamicTableData[index-1]) {
//       //       console.log(v_dynamicTableData[index].e);
//       //     }
//       //     // e.map((key, index) => {
//       //       /* if (e[index].key === e[index-1].key) {
//       //         console.log(e.key);
//       //       } */
//       //       // }
//       //       // return e.key;
//       //     // })
//       //   }
//       //   return e;
//       // })
//       /* if (v_dynamicTableData.length > 1) {
//         for (let i = 1; i < v_dynamicTableData.length; i++) {
//           const prevObject = v_dynamicTableData[i - 1];
//           const currentObject = v_dynamicTableData[i];
  
//           Object.keys(currentObject).forEach((key) => {
//             if (prevObject[key] !== currentObject[key]) {
//               console.log(
//                 `Index ${i - 1} -> ${i}: Key "${key}" changed from "${prevObject[key]}" to "${currentObject[key]}"`
//               );
//             }
//           });
//         }
//       } */
//       setVHandlingHtml(<h1>{v_componentName} Area</h1>);
//       break;
//     case `activity`: 
//       if (v_dynamicTableData.length > 0) {
//         setData(v_dynamicTableData); 
//         // console.log(data);
//         setVHandlingHtml (
//           <>
//           <Table bordered hover responsive {...getTableProps()}>
//             <thead>
//               {headerGroups.map((headerGroup) => {
//                 const { key, ...restProps } = headerGroup.getHeaderGroupProps();
//                 return (
//                   <tr key={key} {...restProps}>
//                     {headerGroup.headers.map((column) => {
//                       const { key, ...restProps } = column.getHeaderProps();
//                       return (
                        
//                         <th key={key} {...restProps}>
//                           {column.render('Header')}
//                         </th>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {rows.map((row) => {
//                 prepareRow(row);
//                 const { key, ...restProps } = row.getRowProps();
//                 return (
//                   <tr key={key} {...restProps}>
//                     {row.cells.map((cell, index) => {
//                       const { key, ...restProps } = cell.getCellProps({ className: 'table-cell' });
//                       return (
//                         <td key={key} {...restProps}>
//                           {cell.render('Cell')}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//           </>
//         )
//       }
//       break;
    
//     default:
//       setVHandlingHtml(<h1>안녕하세요 DynamicTable.js 작업 중입니다.</h1>);
//     // console.log("======= props data =======\n", v_componentName, v_propsData, v_dynamicTableData);
//   }


//   return (
//     <div id='tableArea'>
//       {v_handlingHtml}
      
//       <BizOppHistory show={showModal} onHide={closeModal} />
//     </div>
//   );
// }

export default DynamicTable;
