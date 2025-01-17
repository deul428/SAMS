import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTable, usePagination, useSortBy } from 'react-table';

import BizOppHistory from '../components/BizOppHistory';
import InputFieldDetail from './InputFieldDetail';

import { apiMethods } from './api';
import roots from './datas/Roots';

import { Table, Button, Pagination } from 'react-bootstrap';
import { CaretUp, CaretDown } from 'react-bootstrap-icons';
import '../styles/_table.scss';
import '../styles/_global.scss';
import { useMemo } from 'react';
import { transposeData } from './TransposeTable';

function DynamicTable({ v_componentName, v_propsData, res, tableData, tableColumns, setIsRefresh }) {
  const auth = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [v_modalPropsData, setVModalPropsData] = useState(null);
  const [v_childComponent, setVChildComponent] = useState(null);

  const openModal = (e, handling, isHistory) => {
    if (isHistory === null) {
      setVChildComponent('InputFieldDetail');
    } else {
      setVChildComponent('BizOppHistory');
      e.stopPropagation(); //이벤트 전파 방지
    }
    setVModalPropsData(handling);
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  };
  
  const [data, setData] = useState([]);
  // 테이블 헤더 키 값 갖고 오기
  let rootsData = null;
  switch(v_componentName) {
    case `bizOpp`: 
      rootsData = roots.bizoppSelect1.props;
      break;
    case `activity`: 
      rootsData = roots.activitySelect1.props;
      break;
    default:
      rootsData = roots.bizoppSelect1.props;
      break;
  }
  let columns = React.useMemo(() => rootsData || [], []);
  // const columns = React.useMemo(() => root.bizoppSelect1?.props || [], []);

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
    useSortBy, usePagination
  );
  
  const [activityRow, setActivityRow] = useState([]);
  // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
  useEffect(() => {
    if (!v_propsData || Object.keys(v_propsData).length === 0) {
      console.warn("v_propsData가 비어 있습니다.");
      // setData([]); // 기본값으로 빈 배열 설정
      return;
    }  
    switch (v_componentName){
      case 'bizOpp':
        setData(v_propsData.data.retrieve_biz_opp);
        break;
      case 'activity':
        setData(v_propsData.data.retrieve_biz_opp_activity);
        setActivityRow([...v_propsData.data.retrieve_biz_opp_activity]);
        console.log("activityRow: ", activityRow);
        break;
      default: break;
    }
  }, [v_propsData]);


  const [v_handlingHtml, setVHandlingHtml] = useState(null);
  // =================== input field에서 넘어온 값(res)에 따라 핸들링 ===================
  // res obj / res.data arr
  useEffect(() => {
    console.log("res---------------------------------------(inputField에서 검색했을 때 나오는 데이터)\n", res);
    if ((!res) || (Object.keys(res).length === 0) || (Array.isArray(res) && res.length === 0)) {
      setVHandlingHtml(<div style={{"textAlign" : "left", "margin": "3rem 0"}}>데이터가 존재하지 않습니다.</div>);
      return;
    } else {
      if (res.data.length > 0) {
        console.log("res.data.length: ", res.data.length);
        setData(res.data);
      }
    }
  }, [res])
  // =================== input field에서 넘어온 값(res)에 따라 핸들링 끝 ===================

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
  // 24.12.31. 정렬 토글 아이콘 삽입하려다 못 함
  const [sortStyle, setSortStyle] = useState({"opacity":"0.3"});

  const f_sortStyle = (e, column) => {
    console.log(column.isSorted);
    if (column.isSorted/* column.isSorted && e.target === e.currentTarget */) {
      console.log(e, column, e.target.style, e.target);
      e.target.style.opacity = 1;
      // setSortStyle({"opacity":"1"});
    } 
    if(e.target.style.opacity === 1) {
      e.target.style.opacity = 0.3;
      // setSortStyle({"opacity":"0.3"});
    }
  } 
  // 24.12.31. 정렬 토글 아이콘 삽입하려다 못 함

  useEffect(() => {
    if (
      (typeof(data) === 'object' ? !data : data.length === 0) ||
      (typeof(res) === 'object' ? !res : res.length === 0)
    ) { return <div>Loading...</div>; }

/*     if (!data && (Array.isArray(res) && res.length === 0)) {
      return <div>Loading...</div>;
    } */
    let htmlContent = null;
    if ((typeof(data) === 'object' && data) || (Array.isArray(data) && data.length > 0)) {
      // console.log("data: ", data, "res: ", res);
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
                {page.map((row, index) => {
                  prepareRow(row);
                  const { key, ...restProps } = row.getRowProps();
                  return (
                    <tr key={key} {...restProps} 
                    onClick={(e) => {
                      openModal(e, row.original, null);
                    }}
                    >

                      {row.cells.map((cell, index, num = 0) => {
                        const { key, ...restProps } = cell.getCellProps({ className: 'table-cell' });
                        num += 1;
                        // console.log(row.index)
                        return (
                          <td key={key} {...restProps}>
                            {index === row.cells.length - 1
                            ? 
                            (
                            <Button size="sm" variant="light" onClick={(e) => {
                              openModal(e, row.original, 'history');
                            }}>
                              이력
                            </Button>)
                            : 
                            (index === 0 ? 
                              (<span>{row.index + 1}</span>) 
                              : cell.render('Cell'))
                            }
                          </td>
                        );
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            </>
          )
          setVHandlingHtml(htmlContent);
          break;
        case `activity`: 
          htmlContent = (
            <>
            <Table>
              {activityRow ? (
                <>
                  {page.map((row, key) => {
                    prepareRow(row);
                    const rowData = row.original; // 원본 데이터, accessor에 접근 안 하고 사용하기 위해
                    return (
                      <div key={key} className='mb-4' style={{"border": "1px solid #dee2e6"}}/* <></>의 축약X 버전, key 적을 시 사용 */>
                        <thead>
                          <tr>
                            <th>사업 일련 번호</th>
                            <td>{rowData.biz_opp_id}</td>
                            <th>사업명</th>
                            <td colspan={3}>{rowData.biz_opp_name}</td>
                            <th>소속 본부</th>
                            <td>{rowData.high_dept_name}</td>
                            <th>팀</th>
                            <td>{rowData.change_preparation_dept_name}</td>
                            <th>영업 담당자</th>
                            <td>{rowData.user_name}</td>
                          </tr>
                        </thead>

                        <thead>
                          <tr>
                            <th>계약 일자</th>
                            <td>{rowData.contract_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                            <th>매출 일자</th>
                            <td>{rowData.sale_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                            <th>매출 금액</th>
                            <td>{rowData.sale_amt.toLocaleString('ko-KR')}</td>
                            <th>매출 이익</th>
                            <td>{rowData.sale_profit.toLocaleString('ko-KR')}</td>
                            <th>사업 구분</th>
                            <td>{rowData.biz_section2_name}</td>
                            <th>제품 구분</th>
                            <td>{rowData.product2_name}</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='fullRow'>
                            <td>{rowData.activity_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                            <td colSpan={11}>{rowData.activity_details}</td>
                          </tr>
                        </tbody>
                      </div>
                    );
                  })}
                </>
              ) : ('')}
            </Table>
            </>  
          )
          setVHandlingHtml(htmlContent);
          break;
        default:
          setVHandlingHtml(<h1>안녕하세요 DynamicTable.js 작업 중입니다.</h1>);
          break;
      }
    }
  }, [v_childComponent, v_componentName, page, showModal, res,]);

  return (
    <div id="tableArea">
      {v_handlingHtml}
      {pagination}
      {
        (v_childComponent === 'InputFieldDetail') 
        ? 
        (<InputFieldDetail v_componentName={'bizOpp'} show={showModal} onHide={closeModal} v_propsData={v_propsData} v_modalPropsData={v_modalPropsData} setIsRefresh={setIsRefresh}/> )
        :
        (v_componentName === 'bizOpp') ?
        (<BizOppHistory show={showModal} onHide={closeModal} v_modalPropsData={v_modalPropsData} />)
        : ('')
      }
    </div>
  )
}

export default DynamicTable;
