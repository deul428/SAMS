import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from '../utils/api';

import roots from '../utils/datas/Roots';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';

const SearchField = ({ componentName, data }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

    if(componentName === 'bizOpp') {
        console.log(data[0]);
    }
    // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === '/login' || currentPath === '/login/') {
                await dispatch(setLocation(location.pathname)); // Redux 상태 업데이트를 보장
            }
        };
        syncPath();
    }, [currentPath, location.pathname, dispatch]);
    
    console.log(currentPath);
    // UI 업데이트
    useEffect(() => {
        const updateUI = () => {
            if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            }

            switch (currentPath) {
                // biz-opp/
                case `/${roots[4].depth1}/`:
                    setVHandlingHtml(
                        <>
                            <div className='searchField'>
                                <div className='searchItem'>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">계약 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">매출 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={2} lg={2} className='btnArea col d-flex align-items-center justify-content-end'>
                                            <Button variant='info'>조회</Button>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">진행률</Form.Label>
                                            <div>
                                                <Form.Select size='sm' aria-label='selectBox' className=''>
                                                    <option>선택</option>
                                                    <option value='1'> </option>
                                                    <option value='2'>Two</option>
                                                    <option value='3'>Three</option>
                                                </Form.Select>
                                                <span style={{margin: '0 10px'}}>~</span>
                                                <Form.Select size='sm' aria-label='selectBox' className=''>
                                                    <option>선택</option>
                                                    <option value='1'>One</option>
                                                    <option value='2'>Two</option>
                                                    <option value='3'>Three</option>
                                                </Form.Select>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label for='inputChck' className="">필달 여부</Form.Label>
                                            <Form.Check type={`checkbox`} id={`inputChck`}/>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">본부</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">팀</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className=''>영업 담당자</Form.Label>
                                            <Form.Control size='sm' type='text' placeholder='Default input' />
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
        <div id='search' className='wrap'>
            {v_handlingHtml}
        </div>
    );
};

export default SearchField;
