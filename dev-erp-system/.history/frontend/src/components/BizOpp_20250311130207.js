import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiMethods } from '../utils/api.js';

import DynamicTable from '../utils/DynamicTable.js';
import InputField from '../utils/InputField.js';
import BizOppDetail from './BizOppDetail.js';
import InputFieldDetail from '../utils/InputFieldDetail.js';
import handleFileUpload from '../utils/ExcelTable';
import roots from '../utils/datas/Roots.js';

import { Button } from 'react-bootstrap';
import ExcelTable from './test/ExcelTable';

const BizOpp = () => {
    const navigate = useNavigate();
    // const location = useLocation();
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = roots.bizoppSelect1.endpoint;
    
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    /*-
    데이터 요청 흐름
    1. get(endpoint) 호출 → api.request('get', url) 호출.
    2. api.request에서 axios를 통해 서버에 요청을 보냄.
    3. 서버 응답 객체에서 response.data를 추출하고 반환.
    4. get 함수가 response.data를 그대로 반환.
    -*/

    const [isRefresh, setIsRefresh] = useState(false);
    const [returnMsg, setReturnMsg] = useState(null);
    const f_handlingData = async (method, endpoint, input = null) => {
        try {
            const supportedMethods = ['get', 'post', 'put', 'patch', 'del'];
            if (!supportedMethods.includes(method)) {
                throw new Error('Invalid method');
            }
    
            // 상태 업데이트 여부를 결정
            const isUpdateNeeded = ['post', 'put', 'patch', 'del'].includes(method);
    
            // API 호출
            // apiMethods[method]에서의 [method]: 객체에 동적으로 접근하는 키. method 변수 값에 따라 객체에서 해당 키에 해당하는 값을 동적으로 갖고 온다. 
            // 일반적으로 객체의 프로퍼티를 접근할 때에는 .을 사용하지만, 동적으로 키를 설정할 때에는 []를 사용한다.  apiMethods[method]는 apiMethods.특정method와 같은 의미이다.
            const response = await apiMethods[method](endpoint, input);
    
            // 상태 업데이트: 데이터 갱신이 필요한 경우에만 호출
            if (isUpdateNeeded) {
                const updatedData = await apiMethods.get(endpoint);
            } 
            // console.log(`API Get (수신)\nEndpoint: (BizOpp.js) ${endpoint}\nresponse: `, response);
            if (Array.isArray(response)) {
                alert('로그인이 필요합니다.');
                navigate(`/${roots.login.endpoint}`, { replace: true });
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
   
    // -------------- 세션 대체용 userId 송신 -------------- 
    const auth = useSelector((state) => state.auth);
    const userCheck = {
        a_session_user_id: auth.userId,
    };

    useEffect(() => {
        f_handlingData('post', endpoint, userCheck);
    }, [endpoint]);

    useEffect(() => {
        if (isRefresh === true) {
            setTimeout(() => {
                f_handlingData('post', endpoint, userCheck);
                setIsRefresh(false);
            }, 1000);
        } 
    }, [isRefresh]);
    // -------------- 세션 대체용 userId 송신 끝 -------------- 
      
    const [res, setRes] = useState([]);
    const [authLevels, setAuthLevels] = useState();

    return (
        <>
            {returnMsg || ''}
            <h2>사업 (기회) 조회</h2>
            <InputField v_componentName={'bizOpp'} v_propsData={data} setRes={setRes} setAuthLevels={setAuthLevels}/>
            <div className='wrap' id='bizOpp'>
                <div className='dataPostArea'>
                    <div className='btnArea d-flex justify-content-end'>
                        {(auth.userAuthCode === '0002') ? 
                        <></> : 
                        <>
                        <Button variant='success' className='float-right mb-2' onClick={openModal}>사업 (기회) 등록</Button>
                        <ExcelTable response={data?.data?.retrieve_biz_opp} />
                        </>
                        }
                    </div>
                    
                    <InputFieldDetail show={showModal} onHide={closeModal} v_componentName={'bizOpp'} v_propsData={data} v_modalPropsData={null} authLevels={authLevels} setIsRefresh={setIsRefresh}/>
                    {errMsg ? 
                        (<p>{errMsg}</p>) 
                        :   
                        (data.length === 0 ? 
                            (<p>데이터를 불러오는 중입니다...</p>) : 
                            (<DynamicTable v_componentName={'bizOpp'} v_propsData={data} res={res} setIsRefresh={setIsRefresh}/>)
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default BizOpp;