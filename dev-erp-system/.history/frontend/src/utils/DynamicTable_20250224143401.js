import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTable, usePagination, useSortBy } from 'react-table';

import BizOppHistory from '../components/BizOppHistory';
import InputFieldDetail from './InputFieldDetail';

import { apiMethods } from './api';
import roots from './datas/Roots';

import { Table, Button, Pagination, Row, Col, ModalBody, Modal, FloatingLabel, Form, Collapse, Card } from 'react-bootstrap';
import { CaretUp, CaretDown, ArrowBarDown, ArrowBarUp, TrainFreightFront } from 'react-bootstrap-icons';
import '../styles/_table.scss';
import '../styles/_global.scss';
import { useMemo, useRef } from 'react';
import { transposeData } from './TransposeTable';

function DynamicTable({ v_componentName, v_propsData, res, tableData, tableColumns, setIsRefresh }) {
  const auth = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [v_modalPropsData, setVModalPropsData] = useState(null);
  const [v_childComponent, setVChildComponent] = useState(null);

  const openModal = (e, handling, view) => {
    if (view === 'history') {
      setVChildComponent('BizOppHistory');
      e.stopPropagation(); //이벤트 전파 방지
    } else if (view === 'inputDetail') {
      setVChildComponent('InputFieldDetail');
    } else if (view === 'activity') {
      console.log("openModal() e: ", e, handling);
      // return;
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
      initialState: { pageIndex: 0, pageSize: 10,
        sortBy: [
          { 
            id: 'biz_opp_id',
            desc: true,
          }
        ]
       }, // 초기 페이지 설정
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



  const f_handlingData = async (method, endpoint, input = null, e) => {
    const copy = {
      a_session_user_id: auth.userId,
      a_biz_opp_id: input.biz_opp_id,
      a_detail_no: input.detail_no
    }
    // console.log("e", e, "input", input);
    if (input && e) {
      e.stopPropagation(); //이벤트 전파 방지
      e.preventDefault(); 
    }
    
    input = copy;
    console.log(input);
    try {
      const response = await apiMethods[method](endpoint, input);
      if (response?.status?.STATUS === 'NONE' || response[0]?.STATUS === 'FAIL') {
        if(Array.isArray(response)){
          console.log(response, response[0].STATUS, response[0].MESSAGE);
        } else {
          console.log(response.status.STATUS, response.status.MESSAGE);
        }
        return;
      } else {
        console.log('사업 (기회) 복제 response 송신 완료', "\nendpoint: ", endpoint, "\nresponse: ", response);
        alert('정상적으로 복제되었습니다.'); 
        setIsRefresh(true);
        return response;
      }
      // 송신 끝
      
    } catch (error) {
      console.log('Error during login:', error, `f_handlingData(${method}) error! ${error.message}`);
      alert('오류가 발생했습니다. 관리자에게 문의하세요.', error);
    }
  }


  const [v_handlingHtml, setVHandlingHtml] = useState(null);
  // =================== input field에서 넘어온 값(res)에 따라 핸들링 ===================
  // res obj / res.data arr
  useEffect(() => {
    console.log("res---------------------------------------(inputField에서 검색했을 때 나오는 데이터)\n", res);
    if ((!res) || (Object.keys(res).length === 0) || (res.length === 0)) {
      setVHandlingHtml(<div style={{"textAlign" : "left", "margin": "3rem 0"}}>데이터가 존재하지 않습니다.</div>);
      // return;
    } else {
      if (res.data.length > 0) {
        // console.log("res.data.length: ", res.data.length);
        setData(res.data);
      }
    }
  }, [res])
  // =================== input field에서 넘어온 값(res)에 따라 핸들링 끝 ===================

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

  function groupByBizOppId(data) {
    return data.reduce((acc, item) => {
      const { biz_opp_id } = item;
      if (!acc[biz_opp_id]) {
        acc[biz_opp_id] = []; // 그룹 초기화
      }
      acc[biz_opp_id].push(item); // 그룹에 데이터 추가
      return acc;
    }, {});
  }
  
  const groupedData = groupByBizOppId(data); // 데이터 그룹화



  const [openStates, setOpenStates] = useState({});
  const toggleCollapse = (biz_opp_id) => {
    setOpenStates((prevState) => {
      const newState = {
        ...prevState,
        [biz_opp_id]: !prevState[biz_opp_id], // 해당 ID의 상태를 반전
      };
      return newState;
    });
  };

  useEffect(() => {
    let htmlContent = null;
    if (
      (typeof(data) === 'object' ? !data : data.length === 0) ||
      (typeof(res) === 'object' ? !res : res.length === 0)
    ) { return <div>Loading...</div>; }
/*     if (!data && (Array.isArray(res) && res.length === 0)) {
      return <div>Loading...</div>;
    } */
    if ((typeof(data) === 'object' && data) || (Array.isArray(data) && data.length > 0)) {
      // console.log("data: ", data, "res: ", res);
      switch (v_componentName) {
        case `bizOpp`: 
          htmlContent = (
            <>
            <Table bordered hover responsive {...getTableProps()} className='bizopp'>
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
                      openModal(e, row.original, 'inputDetail');
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
                            <>
                            <Button size="sm" variant='warning' className='btnCell' onClick={(e) => f_handlingData('post', 'clone-biz-opp/', row.original, e)} >복제</Button>
                            </>
                            )
                            : 
                            (index === row.cells.length - 2 ? 
                              <Button size="sm" variant="light" className='btnCell' onClick={(e) => {
                                openModal(e, row.original, 'history');
                              }}>
                                이력
                              </Button>
                             :
                            (index === 0 ? 
                              (<span>{row.index + 1}</span>) 
                              : cell.render('Cell'))
                            )
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
            <Table hover responsive className='activity' >
              {Object.entries(groupedData).map(([biz_opp_id, group], groupIndex) => {
                const commonInfo = group[0]; // 그룹의 첫 번째 데이터를 공통 정보로 사용
                return (
                  <>
                  <div key={groupIndex} className='mb-4 d-flex flex-column'>
                    <tbody>
                      <div className='row'>
                        <div className='col col_oppId col-xl-4 col-lg-4 col-md-12 col-12'>
                          <th>사업 번호</th>
                          <td>{commonInfo.biz_opp_id}</td>
                        </div>
                        <div className='col col_oppName col-xl-8 col-lg-8 col-md-12 col-12'>
                          <th>사업명</th>
                          <td>{commonInfo.biz_opp_name}</td>
                        </div>
                      </div>
                    </tbody>
                    <tbody>
                      <div className='row'>
                        <div className='col col_dept col-xl-4 col-lg-4 col-md-12 col-12'>
                          <th>소속 본부</th>
                          <td>{commonInfo.change_preparation_high_dept_name}</td>
                        </div>
                        <div className='col col_team col-xl-4 col-lg-4 col-md-12 col-12'>
                          <th>팀</th>
                          <td>{commonInfo.change_preparation_dept_name}</td>
                        </div>
                        <div className='col col_user col-xl-4 col-lg-4 col-md-12 col-12'>
                          <th>담당자</th>
                          <td>{commonInfo.user_name}</td>
                        </div>
                      </div>
                    </tbody>
                    <tbody>
                      <div className='row'>
                        <div className='col col_contractDate col-xl-4 col-lg-4 col-md-4 col-12'>
                          <th>계약 일자</th>
                          <td>{commonInfo.contract_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                        </div>
                        <div className='col col_saleDate col-xl-4 col-lg-4 col-md-4 col-12'>
                          <th>매출 일자</th>
                          <td>{commonInfo.sale_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                        </div>
                        <div className='col col_saleAmt col-xl-4 col-lg-4 col-md-4 col-12'>
                          <th>매출 금액</th>
                          <td>{commonInfo.sale_amt.toLocaleString('ko-KR')}</td>
                        </div>
                      </div>
                    </tbody>
                    <tbody>
                      <div className='row'>
                        <div className='col col_saleProfit col-xl-4 col-lg-4 col-md-4 col-12'>
                          <th>매출 이익</th>
                          <td>{commonInfo.sale_profit.toLocaleString('ko-KR')}</td>
                        </div>
                        <div className='col col_sectionName col_10 col-xl-4 col-lg-4 col-md-4 col-12'>
                          <th>대표 사업 구분</th>
                          <td>{commonInfo.delegate_biz_section2_name}</td>
                        </div>
                        <div className='col col_comName col-xl-4 col-lg-4 col-md-4 col-12'>
                          <th>대표 제조사명</th>
                          <td>{commonInfo.delegate_sale_com2_name}</td>
                        </div>
                      </div>
                    </tbody>
                    {group.length > 5 ? 
                      (
                        <>
                        <tbody>
                          {group.map((item, index) => (
                            index > 4 ? 
                            <Collapse in={openStates[biz_opp_id] || false}>
                              <div className='row'>
                                <div id={`collapse-${biz_opp_id}`} className='collapseBox' key={index} onClick={(e) => openModal(e, group[index], 'activity')}>
                                  <div className='col col_detailNo col-xl-2 col-lg-2 col-md-4 col-12'>
                                    <th>상세 번호</th>
                                    <td>{item.detail_no}</td>
                                  </div>
                                  <div className='col col_actDate col-xl-2 col-lg-2 col-md-4 col-12'>
                                    <th>활동 일자</th>
                                    <td>{item.activity_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                                  </div>
                                  <div className='col col_actDetail col-xl-8 col-lg-8 col-md-4 col-12'>
                                    <th>활동 내역</th>
                                    <td className='activityDetails'>{item.activity_details}</td>
                                  </div>
                                </div>
                              </div>
                            </Collapse> : 
                            
                            <div className='row'>
                              <div id={`collapse-${biz_opp_id}`} className='collapseBox' key={index} onClick={(e) => openModal(e, group[index], 'activity')}>
                                <div className='col col_detailNo col-xl-2 col-lg-4 col-md-4 col-12'>
                                  <th>상세 번호</th>
                                  <td>{item.detail_no}</td>
                                </div>
                                <div className='col col_actDate col-xl-2 col-lg-4 col-md-4 col-12'>
                                  <th>활동 일자</th>
                                  <td>{item.activity_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                                </div>
                                <div className='col col_actDetail col-xl-8 col-lg-4 col-md-4 col-12'>
                                  <th>활동 내역</th>
                                  <td className='activityDetails'>{item.activity_details}</td>
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button className='collapseController'
                            variant='dark'
                            onClick={() => toggleCollapse(biz_opp_id)}
                            aria-controls={`collapse-${biz_opp_id}`}
                            aria-expanded={openStates[biz_opp_id] || false}>
                            {openStates[biz_opp_id] ? 
                            <><ArrowBarUp /><span>접기</span></> : 
                            <><ArrowBarDown /><span>모두 펼치기</span></>}
                          </Button>
                        </tbody>
                      </>
                      )
                      :
                      (
                      <tbody>
                        {group.map((item, index) => (
                          <div className='row'>
                            <div id={`collapse-${biz_opp_id}`} className='collapseBox' key={index} onClick={(e) => openModal(e, group[index], 'activity')}>
                              <div className='col col_detailNo col-xl-2 col-lg-4 col-md-4 col-12'>
                                <th>상세 번호</th>
                                <td>{item.detail_no}</td>
                              </div>
                              <div className='col col_actDate col-xl-2 col-lg-4 col-md-4 col-12'>
                                <th>활동 일자</th>
                                <td>{item.activity_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</td>
                              </div>
                              <div className='col col_actDetail col-xl-8 col-lg-4 col-md-4 col-12'>
                                <th>활동 내역</th>
                                <td className='activityDetails'>
                                  <div type='textarea'>
                                    {item.activity_details}
                                  </div>
                                </td>
                              </div>
                            </div>
                          </div>
                        ))}
                      </tbody>
                      ) 
                    }
                  </div>
                  </>
                );
              })}
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
    /* 
    if ((!data && !res) || (!data && Object.keys(res).length === 0) || (!data && res.length === 0)) {
      // console.log('hrere');
      htmlContent = <div style={{"textAlign" : "left", "margin": "3rem 0"}}>데이터가 존재하지 않습니다.</div>;
      setVHandlingHtml(htmlContent);
      // return;
    }  */
  }, [v_childComponent, v_componentName, page, showModal, openStates]);

  return (
    <div id="tableArea">
      {v_handlingHtml}
      {v_componentName === 'bizOpp' ? pagination : ''}
      {
        (v_childComponent === 'InputFieldDetail') 
        ? 
        (<InputFieldDetail v_componentName={'bizOpp'} show={showModal} onHide={closeModal} v_propsData={v_propsData} v_modalPropsData={v_modalPropsData} setIsRefresh={setIsRefresh}/> )
        :
        (v_componentName === 'bizOpp') ?
        (<BizOppHistory show={showModal} onHide={closeModal} v_modalPropsData={v_modalPropsData} />)
        : 
        (<InputFieldDetail v_componentName={'activity'} show={showModal} onHide={closeModal} v_propsData={v_propsData} v_modalPropsData={v_modalPropsData} setIsRefresh={setIsRefresh}/> )
      }
    </div>
  )
}

export default DynamicTable;
