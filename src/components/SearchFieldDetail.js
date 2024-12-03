import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setLocation } from "../redux/reducers/LocationSlice";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import roots from "../utils/datas/Roots";
import '../styles/_customModal.scss';

const SearchFieldDetail = ({ show, onHide }) => {
    console.log("Modal Props - show:", show, ", onHide:", onHide);
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

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
                case `/${roots[4].depth1}/`:
                    setVHandlingHtml(
                        <Modal size='xl' show={show} onHide={onHide}>
                            <Modal.Header closeButton>
                                <Modal.Title className='fs-3'>Modal title</Modal.Title>
                            </Modal.Header> 
                            <Modal.Body>
                                <div className='searchField'>
                                    <div className='searchItem'>
                                        <Row className="row justify-content-center">
                                            <Col xs={12} md={6} lg={4} className="d-flex align-items-center">
                                                <Form.Label className="me-2">사업명</Form.Label>
                                                <Form.Control name='biz_opp_name' value={input.biz_opp_name} size="sm" type="text" className="me-3" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="d-flex align-items-center">
                                                <Form.Label className="me-2">사업 일련 번호</Form.Label>
                                                <Form.Control name='biz_opp_id' value={input.biz_opp_id}  size="sm" type="text" className="me-3" />
                                            </Col>
                                        </Row>
                                        <Row className="row justify-content-center">
                                            <Col xs={12} md={6} lg={4} className="d-flex align-items-center">
                                                <Form.Label className="me-2">영업 담당자</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="text" className="me-3" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="d-flex align-items-center">
                                                <Form.Label className="me-2">소속 팀</Form.Label>
                                                <Form.Control name='change_preparation_dept_name' value={input.change_preparation_dept_name}  size="sm" type="text" className="me-3" />
                                            </Col>
                                        </Row>
                                        <Row className="row justify-content-center">
                                            <Col xs={12} md={6} lg={4} className="d-flex align-items-center">
                                                <Form.Label className="me-2">최종 고객사</Form.Label>
                                                <Form.Control name='user_id' value={input.user_id}  size="sm" type="text" className="me-3" />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className="d-flex align-items-center">
                                                <Form.Label className="me-2">필달 여부</Form.Label>
                                                <Form.Control name='change_preparation_dept_name' value={input.change_preparation_dept_name}  size="sm" type="text" className="me-3" />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={onHide}>닫기</Button>
                                <Button variant="primary">등록</Button>
                                {/* <Button variant="primary">수정</Button> */}
                                <Button variant="warning">사업 (기회) 복제</Button>
                            </Modal.Footer>
                        </Modal>
                    );
                    break;
                default:
                    setVHandlingHtml(<h1>안녕하세요 SearchField.js 작업 중입니다.</h1>);
            }
        };

        updateUI();
    }, [currentPath, show, onHide]);

    return <div id="searchDetail">{v_handlingHtml}</div>;
};

export default SearchFieldDetail;
