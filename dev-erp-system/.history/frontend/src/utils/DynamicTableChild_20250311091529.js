import React, { useState, useEffect, useRef } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import moment from 'moment';
import { apiMethods } from './api';

import roots from './datas/Roots';

import { Table, Button, Pagination } from 'react-bootstrap';
import { CaretUp, CaretDown } from 'react-bootstrap-icons';

import '../styles/_global.scss';
import '../styles/_table.scss'; 

// level 2 테이블 (ex. 사업 (기회) 이력 조회)
function DynamicTableChild({ v_componentName, v_propsData }) {
  const [data, setData] = useState([]);
  // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
  useEffect(() => {
    console.log("v_propsData: ", v_propsData);
    if (!v_propsData /* || Object.keys(v_propsData).length === 0 || !v_propsData.data.retrieve_biz_opp_history */) {
      console.warn("v_propsData가 비어 있습니다.");
      setData([]); // 기본값으로 빈 배열 설정
      return;
    }

    if (v_propsData.data.retrieve_biz_opp_history) {
      setData(v_propsData.data.retrieve_biz_opp_history);
    }
  }, [v_propsData]);

  // 테이블 헤더 키 값 갖고 오기
  let rootsData = null;
  if(roots.bizoppHistory.props) {
    rootsData = roots.bizoppHistory.props;
    switch(v_componentName) {
      case `bizOppHistory`: 
        rootsData = roots.bizoppHistory.props;
        break;
      default:
        rootsData = roots.bizoppSelect1.props;
        break;
    }
  }
  const columns = React.useMemo(() => roots.bizoppHistory?.props || [], []);

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
      initialState: { pageIndex: 0, pageSize: 10, 
        sortBy: [ {id: 'renewal_date', desc: true} ] 
      }, // 초기 페이지 설정
    },
    useSortBy, usePagination
  );

  // =================== pagination jsx ===================  
  // response UI - window width 감지
  const [browserWidth, setBrowserWidth] = useState(0);
  const resizeTimer = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimer.current !== null) return;
      resizeTimer.current = setTimeout(() => {
        resizeTimer.current = null;
        setBrowserWidth(window.innerWidth);
      }, 200);
    };
    // console.log(browserWidth, window.innerWidth);
    window.addEventListener('resize', handleResize);  
    return () => {
      window.addEventListener('resize', handleResize);
    };
  }, [browserWidth, window.innerWidth]);

  const renderPagination = () => {
    let range = 3; // 현재 페이지 앞뒤 몇 개를 표시할지 설정
    const items = [];
  
    if ((browserWidth || window.innerWidth) < 758) {
      range = 1;
      if (pageIndex > range + 1) {
        items.push(<Pagination.Ellipsis key="left-ellipsis" />);
      }
    
      for (let number = Math.max(0, pageIndex - range); number <= Math.min(pageIndex + range, pageCount - 1); number++) {
        items.push(
          <Pagination.Item key={number} active={pageIndex === number} onClick={() => gotoPage(number)}>
            {number + 1}
          </Pagination.Item>
        );
      }
    
      if (pageIndex < pageCount - range - 2) {
        items.push(<Pagination.Ellipsis key="right-ellipsis" />);
      }

      return items;
    } else {
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
    }
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
          {[10, 15, 20, 25, 30, 35, 50, 1000].map(size => (
            <option key={size} value={size}>
              {size}열로 보기
            </option>
          ))}
        </select>
      </div>
    </Pagination>
  )
  
  const [v_handlingHtml, setVHandlingHtml] = useState(null);
  // =================== pagination 끝 ===================
  useEffect(() => {
    if (
      (typeof(data) === 'object' ? !data : data.length === 0) ||
      (typeof(columns) === 'object' ? !columns : columns.length === 0)
    ) { return <div>Loading...</div>; }
    
    if (data.length > 0 || data) {
      // console.log("data: ", ...data, "page: ", ...page);
      let htmlContent = null;
      switch (v_componentName) {
        case `bizOppHistory`: 
        htmlContent = (
            <>
            <Table bordered responsive {...getTableProps()} className='bizoppHistory'>
              <thead>
                {headerGroups.map((headerGroup) => {
                  const { key, ...restProps } = headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...restProps}>
                      {headerGroup.headers.map((column) => {
                        const { key, ...restProps } = column.getHeaderProps(column.getSortByToggleProps());
                        return (
                          <th key={key} {...restProps}>
                            {column.render('Header')}
                            <span className='ms-1' /* style={sortStyle} onClick={(e) => f_sortStyle(e, column)} */>
                              {/* test */}
                              {column.isSorted ? (column.isSortedDesc ? <CaretDown /> : <CaretUp />) : ''}
                              {/* {column.isSorted ? (column.isSortedDesc ? " ⬇︎" : " ⬆︎") : "⬇︎"} */}
                            </span>
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
                        const { key, ...restProps } = cell.getCellProps({ className: 'table-cell historyCell' });
                        return (
                          <td key={key} {...restProps} style={{
                            backgroundColor: cell.column.id.startsWith('u_') && cell.value ? 'red' : 'white',
                          }}>
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
          setVHandlingHtml(htmlContent);
          break;
        default:
          setVHandlingHtml(<h1>안녕하세요 DynamicTable.js 작업 중입니다.</h1>);
      }
    }
    
  }, [v_componentName, data, page]);

  return (
    <div id="tableAreaChild">
      {v_handlingHtml}
      {pagination}
    </div>
  )
}

export default DynamicTableChild;
