import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiMethods } from '../utils/api.js';

import DynamicTableChild from '../utils/DynamicTableChild.js';

import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import '../styles/_search.scss';
import '../styles/_customModal.scss';
import roots from "../utils/datas/Roots.js";

const BizOppHistory = ({ show, onHide, v_modalPropsData }) => {
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    // const endpoint = 'select-biz-opp1'
    const endpoint = roots.bizoppHistory.endpoint;

    // ================= get ================= 
    const f_handlingData = async (method, endpoint, input = null) => {
        try {
            // 유효값 검사
            // ..

            const response = await apiMethods[method](endpoint, input);
            // const response = await apiMethods.get(endpoint);
            
            // console.log(`API Get (수신)\nEndpoint: (BizOpp.js) ${endpoint}\nresponse: `, response);
            if (response.status.STATUS === 'FAIL' || response.status.STATUS === 'NONE') {
                onHide(true);
                alert(response.status.MESSAGE);
                return;
            } else {
                setData(response);
                return response;
            }
        } catch (error) {
            setErrMsg(`f_handlingData(${method}) error! ${error.message}`);
            throw error;
        }
    };
    // ================= POST 끝 ================= 

    // -------------- 세션 대체용 userId 송신 -------------- 
    const auth = useSelector((state) => state.auth);
    let userCheck = {
        a_session_user_id: auth.userId,
    }

    useEffect(() => {
        if(v_modalPropsData) {
            userCheck = {
                a_session_user_id: auth.userId,
                a_biz_opp_id: v_modalPropsData.biz_opp_id,
                a_detail_no: v_modalPropsData.detail_no,

            }
            f_handlingData('post', endpoint, userCheck);
        }
        
    }, [v_modalPropsData]);
    // -------------- 세션 대체용 userId 송신 끝 -------------- 


    useEffect(() => {
        const updateUI = () => {     
            if ((typeof(data) === 'object' ? !data : data.length === 0)
            || (!data.data?.retrieve_biz_opp_history?.length > 0)) { return <div>Loading...</div>; }
            else {
                setVHandlingHtml(
                    <Modal size='xl' fullscreen show={show} onHide={onHide} id='bizOppHistory'>
                        <Modal.Header closeButton>
                            <Modal.Title className='fs-3'>
                                사업 (기회) 이력 조회
                            </Modal.Title>
                        </Modal.Header> 
                        <Modal.Body>
                            <div className='modalcntnt'>
                                <div className="inputField">
                                    <div className="searchItem">
                                        {(v_modalPropsData) ? 
                                            (
                                                <>
                                                    <div className="infoArea mt-2 mb-2">
                                                        <span className="me-2">사업 일련 번호</span>{v_modalPropsData.biz_opp_id}
                                                        <span className="ms-4 me-2">사업명</span>{v_modalPropsData.biz_opp_name}
                                                    </div>
                                                    {/* <Button variant="info" className=''>조회</Button> */}
                                                </>
                                            )
                                            :
                                            ('')
                                        }
                                        
                                    </div>

                                </div>
                                <div className='bizoppHistoryArea mt-4'>
                                    {<DynamicTableChild v_componentName={'bizOppHistory'} v_propsData={
                                        (v_modalPropsData?.biz_opp_id === data.data?.retrieve_biz_opp_history[0].biz_opp_id) ? 
                                            ((v_modalPropsData?.detail_no === data.data?.retrieve_biz_opp_history[0].detail_no) ?
                                            data : null) : null
                                    }/>}
                                </div>
                            </div>
                        </Modal.Body>
                        {/* <Modal.Footer className="btnArea justify-content-center">
                            <Button variant="secondary" onClick={onHide}>
                            닫기
                            </Button>
                        </Modal.Footer> */}
                    </Modal>
                )
            
            }
        };
        updateUI();
    }, [data, show, onHide]);
  
    return (
        // <div id='bizOppHistory'>
        <>
            {v_handlingHtml}
        </>
        // </div>
    )
}

export default BizOppHistory;