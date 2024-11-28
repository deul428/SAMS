import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from '../utils/api';

import roots from '../utils/datas/Roots';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';

const SearchField = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

    // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === '/login') {
                await dispatch(setLocation(location.pathname)); // Redux 상태 업데이트를 보장
            }
        };

        syncPath();
    }, [currentPath, location.pathname, dispatch]);

    // UI 업데이트
    useEffect(() => {
        const updateUI = () => {
            if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            }

            switch (currentPath) {
                case `/${roots[4].depth1}/`:
                    setVHandlingHtml(
                        <>
                            <Button variant="info" className="btnLeft">조회</Button>
                            <div className="searchField">
                                <div className='searchItem'>
                                    <Row className="mb-3 align-items-center">
                                        <Col sm={3} className="d-flex align-items-center">
                                            <Form.Label className="me-2">계약 일자</Form.Label>
                                            FROM&nbsp;&nbsp;<Form.Control size='sm' type='date'/>
                                        </Col>
                                        <Col sm={2} className="d-flex align-items-center">
                                            TO&nbsp;&nbsp;<Form.Control size='sm' type='date'/>
                                        </Col>
                                        <Col sm={3} className="d-flex align-items-center" style={{marginLeft: "2%"}}>
                                            <Form.Label className="me-2">매출 일자</Form.Label>
                                            FROM&nbsp;&nbsp;<Form.Control size='sm' type='date'/>
                                        </Col>
                                        <Col sm={2} className="d-flex align-items-center">
                                            TO&nbsp;&nbsp;<Form.Control size='sm' type='date'/>
                                        </Col>
                                    </Row>
            
                                    <Row className="mb-3 align-items-center">
                                        <Col sm={3} className="d-flex align-items-center">
                                            <Form.Label className="me-2">본부</Form.Label>
                                            <Form.Select size='sm' aria-label="selectBox">
                                                <option>Choose...</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={3} className="d-flex align-items-center">
                                            <Form.Label className="me-2">팀</Form.Label>
                                            <Form.Select size='sm' aria-label="selectBox">
                                                <option>Choose...</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={4} className="d-flex align-items-center">
                                            <Form.Label className="me-2">영업 담당자</Form.Label>
                                            <Form.Control size='sm' type="text" placeholder="Default input" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={3} className="d-flex align-items-center">
                                            <Form.Label className="me-2">진행률</Form.Label>
                                            FROM&nbsp;&nbsp;
                                            <Form.Select size='sm' aria-label="selectBox">
                                                <option>Open this select menu</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={2} className="d-flex align-items-center">
                                            TO&nbsp;&nbsp;
                                            <Form.Select size='sm' aria-label="selectBox">
                                                <option>Open this select menu</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={2} className="d-flex align-items-center">
                                            <Form.Check type={`checkbox`} id={`checkBox`} label={`필달 여부`}/>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </>
                    );
                    break;
                default:
                    setVHandlingHtml(<h1>안녕하세요 SearchField.js 작업 중입니다.</h1>);
            }
        };

        updateUI();
    }, [currentPath]);

    return (
        <div id="search" className="wrap">
            {v_handlingHtml}
        </div>
    );
};

export default SearchField;
