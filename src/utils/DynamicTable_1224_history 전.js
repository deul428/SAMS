import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';

import BizOppHistory from '../components/BizOppHistory';
import InputFieldDetail from './InputFieldDetail';

import { apiMethods } from './api';
import roots from './datas/Roots';

import { Table, Button, Pagination } from 'react-bootstrap';
import '../styles/_table.scss';
import '../styles/_global.scss';

function DynamicTable({ v_componentName, v_propsData }) {
  const [showModal, setShowModal] = useState(false);
  const [v_modalPropsData, setVModalPropsData] = useState(null);
  const [v_childComponent, setVChildComponent] = useState(null);

  const openModal = (e, handling) => {
    // console.log('e: ', e, '\nhandling: ', handling);
    if (handling !== null) {
      setVChildComponent('InputFieldDetail');
      setVModalPropsData(handling);
    } else {
      setVChildComponent('BizOppHistory');
      setVModalPropsData(null);
      e.stopPropagation(); //이벤트 전파 방지
    }
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  };
  

  const [data, setData] = useState(v_propsData?.data?.retrieve_biz_opp || []);


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
  const columns = React.useMemo(() => roots[4]?.props || [], []);
  

  // react-table 훅 설정
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // 페이지 단위로 렌더링되는 데이터
    prepareRow,
    rows,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 15 }, // 초기 페이지 설정
    },
    usePagination
  );
/*   console.log(
    `
    pageCount: ${pageCount}
    pageIndex: ${pageIndex}
    pageSize: ${pageSize}
    `
  ) */
  // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
  useEffect(() => {
    if (!v_propsData || Object.keys(v_propsData).length === 0 || !v_propsData.data?.retrieve_biz_opp) {
      console.warn("v_propsData가 비어 있습니다.");
      setData([]); // 기본값으로 빈 배열 설정
      return;
    }
    setData(v_propsData.data.retrieve_biz_opp);
  }, [v_propsData]);

  // =================== pagination jsx ===================
  const renderPagination = () => {
    const range = 10; // 현재 페이지 앞뒤 몇 개를 표시할지 설정
    const items = [];
  
    // 첫 페이지 항상 표시
    items.push(
      <Pagination.Item key={0} active={pageIndex === 0} onClick={() => gotoPage(0)}>1</Pagination.Item>
    );
  
    // 중간 ellipsis와 현재 페이지 주변
    if (pageIndex > range + 1) {
      items.push(<Pagination.Ellipsis key="left-ellipsis" />);
    }
  
    for (let number = Math.max(1, pageIndex - range); number <= Math.min(pageIndex + range, pageCount - 2); number++) {
      items.push(
        <Pagination.Item key={number} active={pageIndex === number} onClick={() => gotoPage(number)}>
          {number + 1}
        </Pagination.Item>
      );
    }
  
    if (pageIndex < pageCount - range - 2) {
      items.push(<Pagination.Ellipsis key="right-ellipsis" />);
    }
  
    // 마지막 페이지 항상 표시
    if (pageCount > 1) {
      items.push(
        <Pagination.Item key={pageCount - 1} active={pageIndex === pageCount - 1} onClick={() => gotoPage(pageCount - 1)}>
          {pageCount}
        </Pagination.Item>
      );
    }
    return items;
  };

  const pagination = (
    <Pagination className='pagination'>
      <div className='paginationList d-flex mb-2'>
        <Pagination.First className='paginationBtnSet paginationBtnPrev paginationBtnPrevFirst' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Pagination.First>
        <Pagination.Prev className='paginationBtnSet paginationBtnPrev' onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Pagination.Prev>
        {/* {paginationItems} */}
        {/* {items} */}
        {renderPagination()}
        <Pagination.Next className='paginationBtnSet paginationBtnNext paginationBtnNextEnd' onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Pagination.Next>
        <Pagination.Last className='paginationBtnSet paginationBtnNext' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </Pagination.Last>
      </div>
      
      <div className='paginationControll d-flex'>
        {/* <span>
          Page
          <span>
            {pageIndex + 1} of {pageCount} | 
          </span>
        </span> */}
        <span className='paginationGoToPageText me-4'>
          <input type="number" defaultValue={pageIndex + 1} 
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}/>
             / {pageCount} 페이지로 이동
        </span>
        <select className='paginationSelect' value={pageSize} onChange={e => { setPageSize(Number(e.target.value));}}>
          {[10, 15, 20, 25, 30, 35, 50].map(size => (
            <option key={size} value={size}>
              {size}열로 보기
            </option>
          ))}
        </select>
      </div>
    </Pagination>
  )
  
  // =================== pagination 끝 ===================
  useEffect(() => {
    /* console.log("v_childComponent: ", v_childComponent);
    console.log("showModal? ", showModal); */
    if (!data.length || !columns.length) {
      return <div>Loading...</div>;
    }
    
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
                {page.map((row, index) => {
                  prepareRow(row);
                  const { key, ...restProps } = row.getRowProps();
                  return (
                    <tr key={key} {...restProps} 
                    onClick={(e) => {
                      openModal(e, row.original);
                    }}
                    >

                      {row.cells.map((cell, index) => {
                        const { key, ...restProps } = cell.getCellProps({ className: 'table-cell' });
                        return (
                          <td key={key} {...restProps}>
                            {index === row.cells.length - 1
                            ? 
                            (
                            <Button size="sm" variant="light" onClick={(e) => {
                              openModal(e, null);
                            }}>
                              이력
                            </Button>)
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
/*         case `bizOppHistory`: 
          console.log(v_componentName, " 들어왔다~");
          setVHandlingHtml(<h1>{v_componentName} Area</h1>);
          break; */ 
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
                
                {page.map(row => {
                    prepareRow(row);
                    const { key, ...restProps } = row.getRowProps();
                    return (
                        <tr key={key} {...restProps}>
                            {row.cells.map((cell, index) => {
                                const { key, ...restProps } = cell.getCellProps({ className: 'table-cell' });
                                return (
                                    <td key={key} {...restProps}>
                                        {index === row.cells.length - 1
                                        ? (
                                          (console.log("index 존재함")),
                                        <Button size="sm" variant="light" onClick={(e) => {
                                          openModal();
                                        }}>
                                          이력
                                        </Button>)
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
        default:
          setVHandlingHtml(<h1>안녕하세요 DynamicTable.js 작업 중입니다.</h1>);
      }
    }
  }, [v_childComponent, v_componentName, data, page, showModal]);

  return (
    <div id="tableArea">
      {v_handlingHtml}
      {pagination}
      {
        (v_childComponent === 'InputFieldDetail' && v_modalPropsData) 
        ? 
        (<InputFieldDetail v_componentName={'bizOpp'} show={showModal} onHide={closeModal} v_modalPropsData={v_modalPropsData}/> )
        :
        (<BizOppHistory show={showModal} onHide={closeModal} v_modalPropsData={v_modalPropsData} />)
      }
    </div>
  )
}

export default DynamicTable;
