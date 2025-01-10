import { useState, useEffect } from 'react';

import DynamicTable from '../utils/DynamicTable.js';
import InputField from '../utils/InputField.js';
import InputFieldDetail from '../utils/InputFieldDetail.js';

import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { apiMethods } from '../utils/api.js';

import roots from '../utils/datas/Roots.js';

const Activity = () => {
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = roots.bizoppSelect1.endpoint;
    // const endpoint = roots.bizoppHistory.endpoint;

    const [showModal, setShowModal] = useState(false);
    const openModal = () => {console.log(showModal); setShowModal(true)};
    const closeModal = () => setShowModal(false);

    const p_activity = {

    }
    const [input, setInput] = useState(p_activity);
    
/* 
    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        console.log({ name, value }, input);
        setInput({
            ...input,
            [name]: value.trim(),
        });
    } */
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
            console.log(`API Get (수신)\nEndpoint: (BizOpp.js) ${endpoint}\nresponse: `, response);
            setData(response);
            return response;
        } catch (error) {
            setErrMsg(`f_handlingData(${method}) error! ${error.message}`);
            throw error;
        }

    };
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

/*     const currentPath = useSelector((state) => state.location.currentPath); */
    return (
        <>
            <h2>사업 (기회)별 영업 활동 관리</h2>
            <InputField v_componentName={'activity'} v_propsData={data} />
            <div className='wrap'>
                <div className='dataPostArea'>
                    {/* <InputFieldDetail show={showModal} onHide={closeModal} /> */}
                    <div className='btnArea d-flex justify-content-end mb-2'>
                        {/* <Button variant='primary' className='me-2' onClick={openModal}>등록</Button> */}
                        <div>
                        <Button variant='success' className='me-2' onClick={''}>저장</Button>
                        <Button variant='danger' className='' onClick={''}>삭제</Button>
                        </div>
                    </div>
                    {errMsg ? 
                        (<p>{errMsg}</p>) 
                        :   
                        (data.length === 0 ? 
                            (<p>데이터를 불러오는 중입니다...</p>) : 
                            (<DynamicTable v_componentName={'activity'} v_propsData={data} />)
                            // ('')
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Activity;