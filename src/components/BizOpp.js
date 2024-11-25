import { useState, useEffect } from 'react';
import { login } from '../';
import { Table, Form, Button, ButtonGroup, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Columns, Person } from 'react-bootstrap-icons';
import SearchField from './SearchField';
import MyTable from '../utils/Table.js';
import { get, post, put, del } from '../utils/api.js';

const BizOpp = () => {
    // Data Handling
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [userInput, setUserInput] = useState('');
    // 1. Read
    const f_getData = async () => {
        try {
            const response = await get('select-biz-opp/');
            setData(response);
            console.log(`f_getDataBizOpp DB Data: ${JSON.stringify(response.data)}`);
        } catch (error) {
            setErrMsg(`f_getDataBizOpp error! ${error.message}`);
            // throw new Error(errMsg);
            // alert(`f_getDataBizOpp error! ${error.message}`);
        }
    }; 
    // Create - Post()
    const f_postData = async () => {
        try {
            if (!userInput) {
                console.log(`user input is Null or ''.`);
                return;
            };
            const response = await post('select-biz-opp/', { name: userInput })
            console.log(`PostData User Input Data: ${userInput}`);
            f_getData();
            setUserInput('');
        }
        catch (error) {
            setErrMsg(`f_postData error! ${error.message}`);
            // f_getData();
            // throw new Error(errMsg);
        }
    };

    // U - 전체 업데이트. 객체의 모든 값 대체.
    const f_putData = async () => {
        try {
            if (!userInput) {
                console.log(`user input is Null or ''.`);
                return;
            };
            const response = await post('select-biz-opp/', { name: userInput })
            console.log(`PostData User Input Data: ${userInput}`);
            f_getData();
            setUserInput('');
        }
        catch (error) {
            setErrMsg(`f_putData error! ${error.message}`);
            // f_getData();
            // throw new Error(errMsg);
        }
    };
    // // U - 전체 업데이트. 객체의 모든 값 대체.
    // const f_delData = () => {
    //     api.del(endpoint.bizOpp, {name: userInput})
    //     .then({

    //     })
    //     .catch({

    //     });
    // }
    // // Read - Get()
    // if (params === 1) {
    //     f_postData();
    //     console.log(`현재 f_postData() 테스트 중입니다`);
    // }
    
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
                    <Form.Control type="text" placeholder="이름을 입력하세요." value={userInput} onChange={e => setUserInput(e.target.value)}/>
                    <Button onClick={f_postData}>Click</Button>
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
                            {userInput}
                        </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default BizOpp;