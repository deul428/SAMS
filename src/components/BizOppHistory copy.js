import { useState, useEffect } from "react";
import { apiMethods } from '../utils/api.js';
import DynamicTable from '../utils/DynamicTable.js';
import { Modal, Button, Form, Row, Col } from 
"react-bootstrap";

const BizOppHistory = ({ show, onHide }) => {
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const endpoint = 'select-biz-opp2/'

    // ================= get ================= 
    const f_handlingData = async (method, endpoint, input = null) => {
        try {
            // 유효값 검사
            // ..

            // const response = await apiMethods[method](endpoint, input);
            const response = await apiMethods.get(endpoint);
            // console.log(response.data.retrieve_biz_opp);
            setData(response.data.retrieve_biz_opp);
            updateUI();
            return response;
        } catch (error) {
            setErrMsg(`f_handlingData(${method}) error! ${error.message}`);
            throw error;
        }
    }
/*     if (show) {
        console.log('모달 열림!');
        f_handlingData();
        return;
    } */
    // ================= POST 끝 ================= 
    useEffect(() => {
        f_handlingData('get', endpoint).then(response => {
            console.log("데이터 로드 완료:", response);
        }).catch(error => {
            console.error("데이터 로드 실패:", error);
        });
    }, [endpoint]);


    // useEffect(() => {
        console.log(endpoint, data);
        const updateUI = () => {        
            if (!data.length > 0) {
                console.log("아직 데이터 안 들어왔어요...");
                // return <div>Loading...</div>;
            } else {
                console.log('이제 들어왔어요!');
                setVHandlingHtml (
                    <Modal size='xl' fullscreen show={show} onHide={onHide} centered>
                        <Modal.Header closeButton className="btnArea d-flex align-items-center justify-content-between">
                            <Modal.Title className='fs-3'>사업 (기회) 이력 조회
                            </Modal.Title>
                        </Modal.Header>
                        
                        <Modal.Body>
                            <Button variant="info" className='btnLeft'>조회</Button>
                            <div className='inputField modalcntnt'>
                                <div className='searchItem bizoppArea'>
                                    <DynamicTable v_componentName={'bizOppHistory'} propsData={data}/>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>닫기</Button>
                        </Modal.Footer>
                    </Modal>
                );
            }
        };
        // updateUI();
    // }, [data, show, onHide]);
  
    return (
        <div id='bizOppHistory'>
            {v_handlingHtml}
        </div>
    )
}

export default BizOppHistory;