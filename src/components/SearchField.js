import { Button, Form, Row, Col } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import roots from '../utils/datas/Roots';
import { useEffect } from 'react';
const SearchField = () => {
    const location = useLocation();
    let v_handlingHtml = '';
    switch(location.pathname) {
        case (`/${roots[4].depth1}/`):
            v_handlingHtml = 
            <>
                <Button variant='info' className='btnLeft'>조회</Button>
                <div className='searchField'>
                    <div className='searchItem'>
                        {/* <Row className='mb-3'>
                            <Form.Label column sm={1}>일자</Form.Label>
                            <Form.Group as={Col} controlId="dateFrom">
                                <Form.Control type='date'/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="dateTo">
                                <Form.Label column sm={1}>~</Form.Label>
                                <Form.Control type='date'/>
                            </Form.Group>
                        </Row> */}

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

                        {/* <Row className='mb-3'>
                            <Form.Label column sm={1}>진행률</Form.Label>
                            <Form.Group as={Col} controlId="progress">
                                <Form.Select aria-label="selectBox">
                                    <option>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} controlId="mustBe">
                                <Form>
                                    <Form.Check type={`checkbox`} id={`checkBox`} label={`필달 여부`}/>
                                </Form>
                            </Form.Group>
                        </Row> */}
                    </div>
                </div>
            </>
            break;
        default: 
        v_handlingHtml = <h1>안녕하세요 SearchField.js (v_handlingHtml) 작업 중입니다.</h1>

    }

    return (
        <>
            <div id='search' className='wrap'>
                {v_handlingHtml}
            </div>
        </>
    )

}

export default SearchField;