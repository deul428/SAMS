import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiMethods } from '../utils/api.js';

import DynamicTable from '../utils/DynamicTable';
import InputField from '../utils/InputField';
import InputFieldDetail from '../utils/InputFieldDetail.js';

import roots from '../utils/datas/Roots.js';

import { Button } from 'react-bootstrap';

const Activity = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = roots.activitySelect1.endpoint;
    // const endpoint = roots.bizoppSelect1.endpoint;

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

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
            // console.log(isUpdateNeeded, endpoint);
    
            // API 호출
            // apiMethods[method]에서의 [method]: 객체에 동적으로 접근하는 키. method 변수 값에 따라 객체에서 해당 키에 해당하는 값을 동적으로 갖고 온다. 
            // 일반적으로 객체의 프로퍼티를 접근할 때에는 .을 사용하지만, 동적으로 키를 설정할 때에는 []를 사용한다.  apiMethods[method]는 apiMethods.특정method와 같은 의미이다.
            const response = await apiMethods[method](endpoint, input);
            // console.log("response: ", response);
    
            // 상태 업데이트: 데이터 갱신이 필요한 경우에만 호출
            if (isUpdateNeeded) {
                const updatedData = await apiMethods.get(endpoint);
            } 
            console.log(`API Get (수신)\nEndpoint: (Activity.js) ${endpoint}\nresponse: `, response);
            if (Array.isArray(response)) {
                alert(response[0].MESSAGE || '로그인 필요');
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
    }

    useEffect(() => {
        f_handlingData('post', endpoint, userCheck);
    }, [endpoint]);

    useEffect(() => {
        console.log(isRefresh);
        if(isRefresh === true) {
            setTimeout(() => {
                console.log('isRefresh 시작');
                f_handlingData('post', endpoint, userCheck);
            }, 1000);
        }
    }, [isRefresh]);
    // -------------- 세션 대체용 userId 송신 끝 -------------- 

    const [res, setRes] = useState([]);
    return (
        <>
            {returnMsg || ''}
            <h2>사업 (기회)별 영업 활동 관리</h2>
            <InputField v_componentName={'activity'} v_propsData={data} setRes={setRes}/>
            <div className='wrap' id='activity'>
                <div className='dataPostArea'>
                    <h3 style={{textAlign:"center", fontWeight: "600"}} className='mb-4'>영업 활동 등록은 사업 (기회) 관리 - 사업 (기회) 등록에서 진행해 주시기 바랍니다.</h3>
                    {/* <div className='btnArea d-flex justify-content-end'>
                        {(auth.userAuthCode === '0002') ? 
                        <></> : 
                        <div className='mb-2'>
                            <Button variant='success' className='me-2' onClick={''}>영업 활동 등록</Button>
                        </div>
                        }
                    </div> */}
                    {errMsg ? 
                        (<p>{errMsg}</p>) 
                        :   
                        (data.length === 0 ? 
                            (<p>데이터를 불러오는 중입니다...</p>) : 
                            (<DynamicTable v_componentName={'activity'} tableData={data.data.retrieve_biz_opp_activity} tableColumns={roots.activitySelect1.props} v_propsData={data} res={res} setIsRefresh={setIsRefresh}/>)
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Activity;