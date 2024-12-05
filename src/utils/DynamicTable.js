import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { apiMethods } from './api'; // API 호출 메서드
import roots from './datas/Roots';
import { Table, Button } from 'react-bootstrap';
import '../styles/_table.scss'; // 위에서 작성한 CSS를 임포트
import BizOppHistory from '../components/BizOppHistory';

function DynamicTable({ componentName, propsData, show, onHide }) {
  
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
  // const test = (e) => {
  //   e.preventDefault();
  //   console.log("click", e);
    
  //   e.target.nextSibling.append(<BizOppHistory/>);
  // };

  useEffect(() => {
    switch (componentName) {
      case `bizOpp`: 
        if (propsData.length > 0) {
          setData(propsData[0]);
          // console.log("data area: ", data, propsData, componentName);
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
      
      default:
        setVHandlingHtml(<h1>안녕하세요 DynamicTable.js 작업 중입니다.</h1>);
      // console.log("======= props data =======\n", componentName, propsData, propsData[0]);
    }
  }, [componentName, propsData]);


  return (
    <div id='tableArea'>
      {v_handlingHtml}
    </div>
  );
}

export default DynamicTable;
