import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiMethods } from '../utils/api.js';

import DynamicTableChild from '../utils/DynamicTableChild.js';

import { Modal, Button, Form, Row, Col } from 
"react-bootstrap";
import '../styles/_search.scss';
import '../styles/_customModal.scss';

const BizOppHistory = ({ show, onHide, v_modalPropsData }) => {
    // console.log("v_modalPropsData: ", v_modalPropsData);
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    // const endpoint = 'select-biz-opp2/'
    const endpoint = 'select-biz-opp1/'

    // ================= get ================= 
    const f_handlingData = async (method, endpoint, input = null) => {
        try {
            // 유효값 검사
            // ..

            const response = await apiMethods[method](endpoint, input);
            // const response = await apiMethods.get(endpoint);
            console.log(`API Get (수신)\nEndpoint: (BizOppHistory.js) ${endpoint}\nresponse: `, response);
            setData(response);
            return response;
        } catch (error) {
            setErrMsg(`f_handlingData(${method}) error! ${error.message}`);
            throw error;
        }
    };
/*     if (show) {
        console.log('모달 열림!');
        f_handlingData();
        return;
    } */
    // ================= POST 끝 ================= 

    // -------------- 세션 대체용 userId 송신 -------------- 
    const auth = useSelector((state) => state.auth);
    // console.log(auth);
    const userCheck = {
        a_session_user_id: auth.userId,
    }

    useEffect(() => {
        f_handlingData('post', endpoint, userCheck);
        
        /* f_handlingData('get', endpoint).then(response => {
            console.log("데이터 로드 완료:", response);
        }).catch(error => {
            console.error("데이터 로드 실패:", error);
        }); */
    }, [endpoint]);
    // -------------- 세션 대체용 userId 송신 끝 -------------- 


    useEffect(() => {
        const updateUI = () => {        
            if (!data.data?.retrieve_biz_opp?.length > 0) {
                return <div>Loading...</div>;
            } else {
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
                                    <DynamicTableChild v_componentName={'bizOppHistory'} v_propsData={data}/>
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