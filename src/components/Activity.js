import { useState, useEffect } from 'react';

import DynamicTable from '../utils/DynamicTable';
import InputField from '../utils/InputField';
import InputFieldDetail from '../utils/InputFieldDetail.js';

import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { apiMethods } from '../utils/api.js';

import roots from '../utils/datas/Roots.js';

const Activity = () => {
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = roots[4].endpoint;
    console.log("activity data: ======================\n", data);
    // const endpoint = roots[5].endpoint;

    const p_activity = {

    }
    const [input, setInput] = useState(p_activity);
    
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {console.log(showModal); setShowModal(true)};
    const closeModal = () => setShowModal(false);

    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        console.log({ name, value }, input);
        setInput({
            ...input,
            [name]: value,
        });
    }
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

            // 상태 업데이트: 데이터 갱신이 필요한 경우에만 호출
            if (isUpdateNeeded) {
                const updatedData = await apiMethods.get(endpoint);
            } 
            setData(response);
            console.log(response, data);
            return response;
        } catch (error) {
            setErrMsg(`f_handlingData(${method}) error! ${error.message}`);
            throw error;
        }
    };

    useEffect(() => {
        f_handlingData('get', endpoint).then(response => {
            console.log("데이터 로드 완료:", response);
        }).catch(error => {
            console.error("데이터 로드 실패:", error);
        });
    }, [endpoint]);

    const currentPath = useSelector((state) => state.location.currentPath);
    // console.log('currentpath====================\n', currentPath);
    return (
        <>
            <h2>영업 활동 관리</h2>
            <InputField v_componentName={'activity'} v_propsData={data} />
            <div className='wrap'>
                <div className='dataPostArea'>
                    {/* <InputFieldDetail show={showModal} onHide={closeModal} /> */}
                    <div className='btnArea d-flex justify-content-end'>
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