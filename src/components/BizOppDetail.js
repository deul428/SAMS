import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import roots from '../utils/datas/Roots.js';
import axios from 'axios';
import { apiMethods } from '../utils/api.js';
import '../styles/_search.scss';

import InputFieldDetail from '../utils/InputFieldDetail.js';

// 사업 (기회) 등록 및 수정
const BizOppDetail = () => {
    const location = useLocation();
    // Data Handling
    // data: db data
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = roots.bizoppSelect1.endpoint;

    const [content, setContent] = useState(false);
    const p_bizopp = {
        biz_opp_id: '',
        biz_opp_name: '',
        user_id: '',
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
        principal_product1_code: '',
        principal_product2_code: '',
        principal_product1_name: '',
        principal_product2_name: '',
        change_preparation_dept_id: '',
        change_preparation_dept_name: '',
        change_preparation_high_dept_id: '',
        change_preparation_high_dept_name: '',
        create_user: '',
        create_date: '',
        update_user: null,
        update_date: null,
        delete_user: null,
        delete_date: null,
    }
    const [input, setInput] = useState(p_bizopp);
    

    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        // console.log({ name, value }, input);
        setInput({
            ...input,
            [name]: value.trim(),
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
            console.log(`API Get (수신)\nEndpoint: (BizOppDetail.js) ${endpoint}\nresponse: `, response);
    
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
        f_handlingData('get', endpoint);
        // console.log(location);
    }, []);

    return (
        <div id='bizOppDetail'>
            <InputFieldDetail/>
        </div>
    )
}

export default BizOppDetail;