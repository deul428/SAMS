import { useState, useEffect } from 'react';
import { login } from '../';
import { Table, Form, Button, ButtonGroup, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Columns, Person } from 'react-bootstrap-icons';
import SearchField from './SearchField';
import MyTable from '../utils/Table.js';
import { get, post, put, patch, del } from '../utils/api.js';
import axios from 'axios';

const BizOpp = () => {
    // Data Handling
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const endpoint = `api/user/`;
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
    const [input, setInput] = useState({
        username: '', 
        email: '', 
        phone: '',
    });

    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
        })
    }

    const f_getData = async () => {
        try {
            const response = await get(endpoint);
            setData(response);
        } catch (error) {
            setErrMsg(`f_getDataBizOpp error! ${error.message}`);
        }
    };
     
    const f_postData = async () => {
        try {
            const response = await post(endpoint, input);
            f_getData();
        }
        catch (error) {
            setErrMsg(`f_postData error! ${error.message}`);
        }
    };

    // U - 전체 업데이트. 객체의 모든 값 대체. (보내지 않을 경우 null로 처리됨)
    const f_putData = async () => {
        try {
            const response = await put(endpoint+'1/', input);
            f_getData();
        } catch (error) {
            setErrMsg(`f_putData error! ${error.message}`);
        }
    };
    // U - 일부 업데이트. 객체의 일부 값만 대체.
    const f_patchData = async () => {
        try {
            const response = await patch(endpoint+'1/', {username: input.username});
            f_getData();
        } catch (error) {
            setErrMsg(`f_patchData error! ${error.message}`);
        }
    };
    // D - 삭제.
    const f_delData = async () => {
        try {
            const response = await del(endpoint+'9/');
            f_getData();
        } catch (error) {
            setErrMsg(`f_delData error! ${error.message}`);
        }
    }
    
    useEffect(() => {
        f_getData();
    }, []);

    return (
        <>
            <h2>사업 (기회) 조회</h2>
            <SearchField/>
            <div className='wrap'>
                {/* <MyTable /> */}
                <div className="dataPostArea">
                    <Form.Control type="text" name="username" placeholder="이름을 입력하세요." value={input.username} onChange={f_handlingInput}/>
                    <Form.Control type="email" name="email" placeholder="email을 입력하세요." value={input.email} onChange={f_handlingInput}/>
                    <Form.Control type="tel" name="phone" placeholder="번호를 입력하세요." value={input.phone} onChange={f_handlingInput}/>
                    <div>
                        <Button style={{margin: '0 10px'}} variant='primary' onClick={f_getData}>Refresh</Button>
                        <Button style={{margin: '0 10px'}} variant='success' onClick={f_postData}>Post</Button>
                        <Button style={{margin: '0 10px'}} variant='warning' onClick={f_putData}>Put</Button>
                        <Button style={{margin: '0 10px'}} variant='warning' onClick={f_patchData}>Patch</Button>
                        <Button style={{margin: '0 10px'}} variant='danger' onClick={f_delData}>Delete</Button>
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
                                <Table striped="columns" bordered hover className={e.id} key={e.id}>
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