import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { apiMethods } from '../utils/api.js';
import { login } from '../index.js';
import InputField from '../utils/InputField.js';
import DynamicTable from '../utils/DynamicTable.js';
import { Button } from 'react-bootstrap';
import BizOppDetail from './BizOppDetail.js';

import roots from '../utils/datas/Roots.js';

import InputFieldDetail from '../utils/InputFieldDetail.js';

const BizOpp = () => {
    const location = useLocation();
    // Data Handling
    // data: db data
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = roots[4].endpoint;

    // const [content, setContent] = useState(false);
    /*-
    사업 (기회) ID	biz_opp_id
    사업 (기회)명	biz_opp_name
    사용자 ID	user_id
    변경 대비용 부서 ID	change_preparation_dept_id
    변경 대비용 부서명	change_preparation_dept_name
    최종 고객사1 code	last_client_com1_code
    최종 고객사2 code	last_client_com2_code
    매출처1 code	sale_com1_code
    매출처2 code	sale_com2_code
    계약 일자	contract_date
    진행률1 code	progress1_rate
    진행률2 code	progress2_rate
    판품 번호	sale_item_no
    매출 일자	sale_date
    매출 금액	sale_amt
    매출 이익	sale_profit
    매입 일자	purchase_date
    매입 금액	purchase_amt
    사업 구분1 code	biz_section1_code
    사업 구분2 code	biz_section2_code
    필달 여부	essential_achievement_tf
    제품1 code	product1_code
    제품2 code	product2_code
    등록자 ID	create_user
    등록 일시	create_date
    수정자 ID	update_user
    수정 일시	update_date
    삭제자 ID	delete_user
    삭제 일시	delete_date
    -*/

    /*-
    데이터 요청 흐름
    1. get(endpoint) 호출 → api.request('get', url) 호출.
    2. api.request에서 axios를 통해 서버에 요청을 보냄.
    3. 서버 응답 객체에서 response.data를 추출하고 반환.
    4. get 함수가 response.data를 그대로 반환.
    -*/
    const p_bizopp = {
        biz_opp_id: '',
        biz_opp_name: '',
        user_id: '',
        change_preparation_dept_id: '',
        change_preparation_dept_name: '',
        last_client_com1_code: '',
        last_client_com2_code: '',
        last_client_com1_name: '',
        last_client_com2_name: '',
        sale_com1_code: '',
        sale_com2_code: '',
        sale_com1_name: '',
        sale_com2_name: '',
        contract_date: '',
        progress1_rate: '',
        progress2_rate: '',
        sale_item_no: '',
        sale_date: '',
        sale_amt: 0,
        sale_profit: 0,
        purchase_date: '',
        purchase_amt: 0,
        biz_section1_code: '',
        biz_section2_code: '',
        biz_section1_name: '',
        biz_section2_name: '',
        essential_achievement_tf: false,
        product1_code: '',
        product2_code: '',
        product1_name: '',
        product2_name: '',
        dept_id: '',
        high_dept_id: '',
        dept_name: '',
        high_dept_name: '',
        create_user: '',
        create_date: '',
        update_user: null,
        update_date: null,
        delete_user: null,
        delete_date: null,
    }
    const [input, setInput] = useState(p_bizopp);

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
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
      

    return (
        <>
            <h2>사업 (기회) 조회</h2>
            <InputField v_componentName={'bizOpp'} v_propsData={data}/>
            <div className='wrap' id='bizOpp'>
                <InputFieldDetail show={showModal} onHide={closeModal}/*  v_componentName={'bizOppHistory'} v_propsData={data} *//>
                <div className='dataPostArea'>
                    <div className='btnArea d-flex justify-content-end'>
                        <Button variant='success' className='float-right' onClick={openModal}>사업 (기회) 등록</Button>
                    </div>
                    
                    {errMsg ? 
                        (<p>{errMsg}</p>) 
                        :   
                        (data.length === 0 ? 
                            (<p>데이터를 불러오는 중입니다...</p>) : 
                            (<DynamicTable v_componentName={'bizOpp'} v_propsData={data} />)
                            // ('')
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default BizOpp;