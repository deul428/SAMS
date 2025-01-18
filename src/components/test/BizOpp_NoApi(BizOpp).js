import { useState, useEffect } from 'react';
import { login } from '../../index.js';
import { Table, Form, Button, ButtonGroup, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Columns, Person } from 'react-bootstrap-icons';
import InputField from '../InputField.js';
import MyTable from '../utils/Table.js';
import { apiMethods } from '../../utils/api.js';
import axios from 'axios';

const BizOpp = () => {
    // Data Handling
    // data: db data
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = `select-biz-opp/`;
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
    제품1 code	principal_product1_code
    제품2 code	principal_product2_code
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
        sale_com1_code: '',
        sale_com2_code: '',
        contract_date: '',
        progress1_rate: '',
        progress2_rate: '',
        sale_item_no: '',
        sale_date: '',
        sale_amt: '',
        sale_profit: '',
        purchase_date: '',
        purchase_amt: '',
        biz_section1_code: '',
        biz_section2_code: '',
        essential_achievement_tf: '',
        principal_product1_code: '',
        principal_product2_code: '',
        create_user: '',
        create_date: '',
        update_user: '',
        update_date: '',
        delete_user: '',
        delete_date: '',
    }
    const [input, setInput] = useState(p_bizopp);
    

    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
        })
    }

    const f_handlingData = async (method, endpoint, input = null) => {
        try {
            console.log(p_bizopp);
            const supportedMethods = ['get', 'post', 'put', 'patch', 'del'];
            if (!supportedMethods.includes(method)) {
                throw new Error('Invalid method');
            }
    
            // 상태 업데이트 여부를 결정
            const isUpdateNeeded = ['post', 'put', 'patch', 'del'].includes(method);
            console.log(isUpdateNeeded, endpoint);
    
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
        f_handlingData('get', endpoint);
    }, []);

    return (
        <>
            <h2>사업 (기회) 조회</h2>
            <InputField/>
            <div className='wrap'>
                {/* <MyTable /> */}
                <div className='dataPostArea'>
                     {/* <div className='ex'>
                        <Form.Control type='text' name='biz_opp_name' placeholder='사업명을 입력하세요.' value={input.biz_opp_name} onChange={f_handlingInput}/>
                        <Form.Control type='text' name='user_name' placeholder='유저 이름을 입력하세요.' value={input.user_name} onChange={f_handlingInput}/>
                        <Form.Control type='text' name='last_client_com2_name' placeholder='최종 고객사 상호를 입력하세요.' value={input.last_client_com2_name} onChange={f_handlingInput}/>
                        <div>
                            <Button style={{ margin: '0 10px' }} variant='primary' onClick={() => f_handlingData('get', endpoint)}>Refresh</Button>
                            <Button style={{ margin: '0 10px' }} variant='success' onClick={() => f_handlingData('post', endpoint, input)}>Post</Button>
                            <Button style={{ margin: '0 10px' }} variant='warning' onClick={() => f_handlingData('put', endpoint, input)}>Put</Button>
                            <Button style={{ margin: '0 10px' }} variant='warning' onClick={() => f_handlingData('patch', endpoint, input)}>Patch</Button>
                            <Button style={{ margin: '0 10px' }} variant='danger' onClick={() => f_handlingData('del', endpoint)}>Delete</Button>
                        </div>
                    </div> */}
                    <Form.Control type='text' name='username' placeholder='이름을 입력하세요.' value={input.username} onChange={f_handlingInput}/>
                    <Form.Control type='email' name='email' placeholder='email을 입력하세요.' value={input.email} onChange={f_handlingInput}/>
                    <Form.Control type='tel' name='phone' placeholder='번호를 입력하세요.' value={input.phone} onChange={f_handlingInput}/>
                    <div>
                    <Button style={{ margin: '0 10px' }} variant='primary' onClick={() => f_handlingData('get', endpoint)}>Refresh</Button>
                    <Button style={{ margin: '0 10px' }} variant='success' onClick={() => f_handlingData('post', endpoint, input)}>Post</Button>
                    <Button style={{ margin: '0 10px' }} variant='warning' onClick={() => f_handlingData('put', endpoint, input)}>Put</Button>
                    <Button style={{ margin: '0 10px' }} variant='warning' onClick={() => f_handlingData('patch', endpoint, input)}>Patch</Button>
                    <Button style={{ margin: '0 10px' }} variant='danger' onClick={() => f_handlingData('del', endpoint)}>Delete</Button>

                    </div>
                    {errMsg ? 
                    (<p>{errMsg}</p>) 
                    :   (
                        <div>
                            <h1>DataPosts.js</h1>
                            {data.map((e) => 
                            <p>{`키 ${Object.keys(e)}와 밸류 ${Object.values(e)}`}</p>)}

                            <h2>1. 객체 그대로 출력</h2>
                            {data.map((e) => 
                            (<p className={e.id} key={e.id}>{JSON.stringify(e)}</p>
                            ))}

                            <h2>2. 객체의 키-값 쌍을 분해해서 출력 - Object.entries(): 객체의 &#123;key:value&#124; 형식을 배열 형태의 [key, value]로 변환해 줌.</h2>
                            {data.map((e) => (
                                <div className={e.id} key={e.id}>
                                    {Object.entries(e).map(([key, value]) => (
                                        <p key={key}>{`key: ${key}, value: ${value}`}</p>
                                    ))}
                                </div>
                            ))}

                            
                            <h2>3. 객체의 키-값 쌍을 분해해서 테이블 형태로 출력</h2>
                            {data.map((e) => (
                                <Table striped='columns' bordered hover className={e.id} key={e.id}>
                                    <thead>
                                        <tr><th colSpan={2}>{e.id}</th></tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(e).map(([key, value]) => (
                                            <tr key={key}>
                                                <th>{`key: ${key}`}</th>
                                                <td>{`value: ${value}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                
                            ))} 
                        </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default BizOpp;