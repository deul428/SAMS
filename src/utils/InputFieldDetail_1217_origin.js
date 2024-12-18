import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setLocation } from "../redux/reducers/LocationSlice";

import roots from "./datas/Roots";
import '../styles/_customModal.scss';
import '../styles/_search.scss';
import { Modal, Button, Form, Row, Col, ListGroup } from "react-bootstrap";

const InputFieldDetail = ({ show, onHide }) => {
    // console.log("Modal Props - show:", show, ", onHide:", onHide);
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [endpoint, setEndpoint] = useState(null);


    // // 등록인지 수정인지 나눔 (개발 중)
    const [isAdded, setIsAdded] = useState(false); 
    // if (show) {
    //     return setIsAdded(true);
    // }

    // 삭제 누를 시 confirm 
    const f_warningMsg = () => {
        if (window.confirm('정말 삭제하시겠습니까?')){
            alert('삭제 완료');
            onHide(true);
        } else {
            return;
        }
    }
    // 사업 기회 조회 테이블부 핸들링
    const p_bizopp = {
        biz_opp_id: '',
        biz_opp_name: '',
        user_id: '',
        change_preparation_dept_id: '',
        change_preparation_dept_name: '',
        last_client_com1_code: '',
        last_client_com2_code: '',
        last_client_com1_name: '',
        last_client_com2_name: '',
        sale_com1_code: '',
        sale_com2_code: '',
        sale_com1_name: '',
        sale_com2_name: '',
        contract_date: '',
        progress1_rate: '',
        progress2_rate: '',
        sale_item_no: '',
        sale_date: '',
        sale_amt: 0,
        sale_profit: 0,
        purchase_date: '',
        purchase_amt: 0,
        biz_section1_code: '',
        biz_section2_code: '',
        biz_section1_name: '',
        biz_section2_name: '',
        essential_achievement_tf: false,
        product1_code: '',
        product2_code: '',
        product1_name: '',
        product2_name: '',
        dept_id: '',
        high_dept_id: '',
        dept_name: '',
        high_dept_name: '',
        create_user: '',
        create_date: '',
        update_user: null,
        update_date: null,
        delete_user: null,
        delete_date: null,
    }
    const [input, setInput] = useState(p_bizopp);
    
    // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === "/login") {
                await dispatch(setLocation(location.pathname));
            }
        };

        syncPath();
    }, [currentPath, location.pathname, dispatch]);

    // UI 업데이트
    useEffect(() => {
        const updateUI = () => {
            if (!currentPath || currentPath === "/login") {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            }
            
            switch (currentPath) {
                case (`/${roots[4].depth1}/` || `/${roots[5].depth1}/`):
                    setVHandlingHtml(
                        <Modal size='xl' show={show} onHide={onHide} centered>
                            <Modal.Header closeButton>
                                <Modal.Title className='fs-3'>{
                                    show && isAdded ? '사업 (기회) 등록' : '사업 (기회) 수정'
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
                                                <Form.Control name='biz_opp_id' value={input.biz_opp_id}  size="sm" type="text" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">사업명</Form.Label>
                                                <Form.Control name='biz_opp_name' value={input.biz_opp_name} size="sm" type="text" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">판품 번호</Form.Label>
                                                <Form.Control name='biz_opp_name' disabled value={input.biz_opp_name} size="sm" type="text" className="" />
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">본부</Form.Label>
                                                <Form.Control name='change_preparation_dept_name' value={input.change_preparation_dept_name}  size="sm" type="text" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">소속 팀</Form.Label>
                                                <Form.Control name='change_preparation_dept_name' value={input.change_preparation_dept_name}  size="sm" type="text" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">영업 담당자</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id} size="sm" type="text" className="" />
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">최종 고객사</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="text" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출처</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="text" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label for='inputChck' className="">필달 여부</Form.Label>
                                                <Form.Check type={`checkbox`} id={`inputChck`}/>
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">사업 구분</Form.Label>
                                                <Form.Select size='sm' aria-label='selectBox' className=''>
                                                    <option>선택</option>
                                                    <option value='1'>One</option>
                                                    <option value='2'>Two</option>
                                                    <option value='3'>Three</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">제품</Form.Label>
                                                <Form.Select size='sm' aria-label='selectBox' className=''>
                                                    <option>선택</option>
                                                    <option value='1'>One</option>
                                                    <option value='2'>Two</option>
                                                    <option value='3'>Three</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-st art">
                                                <Form.Label className="">수금 일자</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="date" className="" />
                                            </Col>
                                            
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">계약 일자</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="date" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출 일자</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="date" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매입 일자</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="date" className="" />
                                            </Col>
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출 금액</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="number" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매입 금액</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="number" className="" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">매출 이익</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="number" className="" />
                                            </Col>
                                            
                                        </Row>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                                <Form.Label className="">진행률</Form.Label>
                                                <Form.Select size='sm' aria-label='selectBox' className=''>
                                                    <option>선택</option>
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
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="text" className="col-lg-10 col-md-10 col-10" />
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
                                <Button variant="primary">등록</Button>
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
    }, [currentPath, show, onHide]);

    return <div id="inputFieldDetail">{v_handlingHtml}</div>;
};

export default InputFieldDetail;
