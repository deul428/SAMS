import { useState, useEffect } from "react";
import { apiMethods } from '../utils/api.js';
import DynamicTable from '../utils/DynamicTable.js';
import { Modal, Button, Form, Row, Col } from 
"react-bootstrap";

const BizOppHistory = ({ show, onHide }) => {
    console.log("Modal Props - show:", show, ", onHide:", onHide);
  
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

    const endpoint = 'test/';
    const f_handlingData = async (method, endpoint, input = null) => {
        try {
            const response = await apiMethods.get(endpoint);
            console.log(response);
            setData(response);
            return response;
        } catch (error) {
            setErrMsg(`f_handlingData(${method}) error! ${error.message}`);
            throw error;
        }
    };
    useEffect(() => {
        f_handlingData('get', endpoint);
    }, []);
    useEffect(() => {
        setVHandlingHtml(
            <Modal size='xl' fullscreen show={show} onHide={onHide} centered>
                <Modal.Header closeButton className="btnArea d-flex align-items-center justify-content-between">
                    <Modal.Title className='fs-3'>사업 (기회) 이력 조회
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Button variant="info" className='btnLeft'>조회</Button>
                    <div className='inputField modalcntnt'>
                        <div className='searchItem bizoppArea'>
                            <DynamicTable componentName={'bizOppHistory'} propsData={''}/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>닫기</Button>
                </Modal.Footer>
            </Modal>
        );
    }, [show, onHide]);
  
    return (
        <div id='bizOppHistory'>
            {v_handlingHtml}
        </div>
    )
}

export default BizOppHistory;