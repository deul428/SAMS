import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setLocation } from "../redux/reducers/LocationSlice";

import roots from "./datas/Roots";
import '../styles/_customModal.scss';
import '../styles/_search.scss';
import { Modal, Button, Form, Row, Col, ListGroup } from "react-bootstrap";

const InputFieldDetail = ({ show, onHide, v_componentName, v_propsData, v_modalPropsData }) => {
    // console.log(v_componentName, "Modal Props - show:", show, ", onHide:", onHide);
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [endpoint, setEndpoint] = useState(null);
    
    // 삭제 누를 시 confirm 
    const f_warningMsg = () => {
        if (window.confirm('정말 삭제하시겠습니까?')){
            alert('정상적으로 삭제되었습니다.');
            onHide(true);
        }
    }

    // ================= 사업 기회 조회 테이블부 핸들링 ================= 
    // ----------------- 1) 수정 시 핸들링 -----------------
    // ..................... 날짜 위젯과 매핑 YYYYMMDD -> YYYY-MM-DD .....................
    const dateKeys = ["sale_date", "collect_money_date", "purchase_date", "contract_date"];
    const formattedDates = {};
    if (v_modalPropsData) {
        dateKeys.forEach(key => {
            if (v_modalPropsData[key]) {
                return formattedDates[key] = v_modalPropsData[key].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
            }
        });

        /* console.log(
            "(매출 일자) propsSaleDate: ", formattedDates.sale_date,
            "\n(수금 일자) propsCollectMoneyDate: ", formattedDates.collect_money_date,
            "\n(매입 일자) propsPurchaseDate: ", formattedDates.purchase_date,
            "\n(계약 일자) propsContractDate: ", formattedDates.contract_date
        ); */
    }
    // ..................... 날짜 위젯과 매핑 YYYYMMDD -> YYYY-MM-DD 끝 .....................
    
    // ..................... 숫자 문자열로 변환 후 쉼표 추가 ..................... 
    const [value, setValue] = useState(0);
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 숫자에 쉼표 추가
    };
    // ..................... 숫자 문자열로 변환 후 쉼표 추가 끝 ..................... 
    // ----------------- 1) 수정 시 핸들링 끝 -----------------

    // ----------------- 2) 등록 및 수정 input 핸들링 -----------------
    // ..................... post용 객체, input field value 저장해서 이후 서버로 송신 ..................... 
    const p_bizopp = {
        biz_opp_id: '',
        biz_opp_name: '테스트입니다',
        // biz_section1_code: '',
        // biz_section2_code: '',
        // biz_section1_name: '',
        biz_section2_name: '',
        // change_preparation_dept_id: '',
        // change_preparation_dept_name: '',
        collect_money_date: '',
        contract_date: '',
        // dept_id: '',
        dept_name: '',
        essential_achievement_tf: false,
        // high_dept_id: '',
        high_dept_name: '',
        // last_client_com1_code: '',
        // last_client_com2_code: '',
        // last_client_com1_name: '',
        last_client_com2_name: '',
        // principal_product1_code: '',
        // principal_product2_code: '',
        // product1_name: '',
        product2_name: '',
        // progress1_rate_code: '',
        // progress2_rate_code: '',
        // progress1_rate_name: '',
        progress2_rate_name: '',
        purchase_amt: 0,
        purchase_date: '',
        sale_amt: 0,
        // sale_com1_code: '',
        // sale_com2_code: '',
        // sale_com1_name: '',
        sale_com2_name: '',
        sale_date: '',
        sale_item_no: '',
        sale_profit: 0,
        // user_id: '',
        user_name: '',

        /* create_user: '',
        create_date: '',
        update_user: null,
        update_date: null,
        delete_user: null,
        delete_date: null, */
    }
    const [input, setInput] = useState(p_bizopp);

    // input field 값 input에 저장
    const f_handlingInput = (e) => {
        if (e.target.name === 'a_essential_achievement_tf') {
            e.target.checked ? e.target.value = true : e.target.value = false;
        }
        const { name, value } = e.target;
        console.log(name);
        // input 업데이트
        setInput((prevInput) => {
            const newState = { ...prevInput, [name]: value.trim() };
            console.log("f_handlingInput 업데이트된 상태:", newState);
            return newState;
        });
    }     
    // ..................... post용 객체, input field value 저장해서 이후 서버로 송신 끝 .....................
    // ----------------- 2) 등록 및 수정 input 핸들링 끝 -----------------
    // ================= 사업 기회 조회 테이블부 핸들링 끝 ================= 

    
    // ================= POST ================= 
    const f_submitData = async (method, endpoint, input = null, e) => {
        e.preventDefault(); // submit 방지
        try {
            // 유효값 검사
            // ...
            // 금액 등 숫자로 표시되어야 하는 것들 텍스트 -> 숫자 변환
            if (e.target.name === 'sale_amt' || e.target.name === 'sale_profit' || e.target.name === 'purchase_amt') {
                const rawValue = e.target.value.replace(/,/g, ""); // 쉼표 제거
                if (!isNaN(rawValue)) {
                    setValue(Number(rawValue)); // 숫자로 변환
                }
            }
            console.log("제출할 input: ", input);

            /* const response = await apiMethods[method]('select-biz-opp2/', input);
            console.log('input Field response 송신 완료', endpoint, response);
            return response; */
        } catch (error) {
            console.log('Error during login:', error, `f_handlingData(${method}) error! ${error.message}`);
            alert('오류가 발생했습니다. 관리자에게 문의하세요.', error);
        }
    }
    // ================= POST 끝 ================= 

/*     // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === "/login") {
                await dispatch(setLocation(location.pathname));
            }
        };

        syncPath();
    }, [currentPath, location.pathname, dispatch]); */
    // UI 업데이트
    useEffect(() => {
        const updateUI = () => {
            /* if (!currentPath || currentPath === "/login") {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            } */
            switch (v_componentName) {
                case `bizOpp`:
                    setVHandlingHtml(
                        <Modal size='xl' show={show} onHide={onHide} centered>
                            <Modal.Header closeButton>
                                <Modal.Title className='fs-3'>{
                                    (v_modalPropsData ? '사업 (기회) 수정': '사업 (기회) 등록')
                                }
                                </Modal.Title>
                            </Modal.Header> 
                            <Modal.Body>
                                <div className='inputField modalcntnt'>
                                    <div className="btnArea text-lg-end">
                                        <Button variant="warning" className="mb-3">사업 (기회) 복제</Button>
                                    </div>
                                    <div className='searchItem bizoppArea'>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">사업 일련 번호</Form.Label>
                                                <Form.Control name='biz_opp_id'  onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.biz_opp_id
                                                    : (input.biz_opp_id || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">사업명</Form.Label>
                                                <Form.Control name='biz_opp_name'  onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.biz_opp_name
                                                    : (input.biz_opp_name || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">판품 번호</Form.Label>
                                                <Form.Control disabled name='sale_item_no' onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.sale_item_no
                                                    : (input.sale_item_no || '')
                                                )} />
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">본부</Form.Label>
                                                <Form.Control name='high_dept_name' onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.high_dept_name
                                                    : (input.high_dept_name || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">소속 팀</Form.Label>
                                                <Form.Control name='dept_name'  onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.dept_name
                                                    : (input.dept_name || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">영업 담당자</Form.Label>
                                                <Form.Control name='user_name' onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.user_name
                                                    : (input.user_name || '')
                                                )} 
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">최종 고객사</Form.Label>
                                                <Form.Control name='last_client_com2_name' onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.last_client_com2_name
                                                    : (input.last_client_com2_name || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출처</Form.Label>
                                                <Form.Control name='sale_com2_name' onChange={f_handlingInput} size="sm" type="text" className="" 
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.sale_com2_name
                                                    : (input.sale_com2_name || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label htmlFor='inputChck' className="">필달 여부</Form.Label>
                                                <Form.Check type={`checkbox`} id={`inputChck`}  name='essential_achievement_tf' onChange={f_handlingInput}
                                                value={
                                                (v_modalPropsData ? 
                                                    v_modalPropsData.essential_achievement_tf
                                                    : (input.essential_achievement_tf || false)
                                                )}/>
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">사업 구분</Form.Label>
                                                <Form.Select size='sm' aria-label='selectBox' className='' name='biz_section2_name' onChange={f_handlingInput} 
                                                value={
                                                (v_modalPropsData ? 
                                                    (v_modalPropsData.biz_section2_name)
                                                    :
                                                    (input.biz_section2_name || ''))
                                                }>
                                                    <option value={(v_modalPropsData ? v_modalPropsData.biz_section2_name : '선택')}>{(v_modalPropsData ? v_modalPropsData.biz_section2_name : '선택')}</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </Form.Select>
                                                
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">제품</Form.Label>
                                                <Form.Select size='sm' aria-label='selectBox' className=''name='product2_name' onChange={f_handlingInput} 
                                                value={
                                                (v_modalPropsData ? 
                                                    (v_modalPropsData.product2_name)
                                                    :
                                                    (input.product2_name || ''))
                                                }>
                                                    <option value={(v_modalPropsData ? v_modalPropsData.product2_name : '선택')}>{(v_modalPropsData ? v_modalPropsData.product2_name : '선택')}</option>
                                                    <option value='1'>One</option>
                                                    <option value='2'>Two</option>
                                                    <option value='3'>Three</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-st art">
                                                <Form.Label className="">수금 일자</Form.Label>
                                                <Form.Control name='collect_money_date' size="sm" type="date" className="" onChange={f_handlingInput}
                                                value={
                                                (v_modalPropsData ? 
                                                    (formattedDates.collect_money_date)
                                                    :
                                                    (input.collect_money_date || ''))
                                                }/>
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">계약 일자</Form.Label>
                                                <Form.Control name='contract_date' size="sm" type="date" className="" onChange={f_handlingInput} 
                                                value={
                                                (v_modalPropsData ? 
                                                    (formattedDates.contract_date)
                                                    : (input.contract_date || '')
                                                )}
                                                />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출 일자</Form.Label>
                                                <Form.Control name='sale_date' size="sm" type="date" className="" onChange={f_handlingInput}
                                                value={
                                                (v_modalPropsData ? 
                                                    (formattedDates.sale_date)
                                                    :
                                                    (input.sale_date || ''))
                                                }/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매입 일자</Form.Label>
                                                <Form.Control name='purchase_date' size="sm" type="date" className="" onChange={f_handlingInput}
                                                value={
                                                (v_modalPropsData ? 
                                                    (formattedDates.purchase_date)
                                                    :
                                                    (input.purchase_date || ''))
                                                }/>
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출 금액</Form.Label>
                                                <Form.Control name='sale_amt' size="sm" type="text" className="" onChange={f_handlingInput} 
                                                value={
                                                (v_modalPropsData ? 
                                                    formatNumber(v_modalPropsData.sale_amt)
                                                    : (input.sale_amt || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매입 금액</Form.Label>
                                                <Form.Control name='purchase_amt' size="sm" type="text" className="" onChange={f_handlingInput} 
                                                value={
                                                (v_modalPropsData ? 
                                                    formatNumber(v_modalPropsData.purchase_amt)
                                                    : (input.purchase_amt || '')
                                                )}/>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출 이익</Form.Label>
                                                <Form.Control name='sale_profit' size="sm" type="text" className="" onChange={f_handlingInput} 
                                                value={
                                                (v_modalPropsData ? 
                                                    formatNumber(v_modalPropsData.sale_profit)
                                                    : (input.sale_profit || '')
                                                )}/>
                                            </Col>
                                            
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">진행률</Form.Label>
                                                <Form.Select size='sm' aria-label='selectBox' className='' name='progress2_rate_name' onChange={f_handlingInput} 
                                                value={
                                                (v_modalPropsData ? 
                                                    (v_modalPropsData.progress2_rate_name)
                                                    :
                                                    (input.progress2_rate_name || ''))
                                                }>
                                                    <option value={(v_modalPropsData ? v_modalPropsData.progress2_rate_name : '선택')}>{(v_modalPropsData ? v_modalPropsData.progress2_rate_name : '선택')}</option>
                                                    <option value='1'>One</option>
                                                    <option value='2'>Two</option>
                                                    <option value='3'>Three</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="searchItem activityArea">
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={12} lg={12} className="activity col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">활동 내역</Form.Label>
                                                <Form.Control name='activity_details' value={input.activity_details || ''} onChange={f_handlingInput} size="sm" type="text" className="col-lg-10 col-md-10 col-10" />
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <ListGroup as="ol" numbered>
                                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                                                    <div className="ms-2 me-auto">
                                                    <div className="fw-bold">Subheading</div>
                                                    Cras justo odio
                                                    </div>
                                                </ListGroup.Item>
                                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                                                    <div className="ms-2 me-auto">
                                                    <div className="fw-bold">Subheading</div>
                                                    Cras justo odio
                                                    </div>
                                                </ListGroup.Item>
                                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                                                    <div className="ms-2 me-auto">
                                                    <div className="fw-bold">Subheading</div>
                                                    Cras justo odio
                                                    </div>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Row>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="btnArea justify-content-center">
                                <Button variant="primary" onClick={(e) => f_submitData('post', endpoint, input, e)}>등록</Button>
                                <Button variant="danger" onClick={f_warningMsg}>삭제</Button>
                                <Button variant="secondary" onClick={onHide}>닫기</Button>
                            </Modal.Footer>
                        </Modal>
                    );
                    break;
                default:
                    setVHandlingHtml(<h1>안녕하세요 InputFieldDetail.js 작업 중입니다.</h1>);
            }
        };

        updateUI();
    }, [/* currentPath */, show, onHide, input, /* v_modalPropsData */]);

    return <div id="inputFieldDetail">{v_handlingHtml}</div>;
};

export default InputFieldDetail;
