import { useEffect } from 'react';
import axios, { formToJSON } from 'axios';
import { useState } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
const DataPost = () => {
    // Get (요청)
    // useEffect는 랜더링 이후에 실행됨. -> UI  업데이트 후 데이터를 가지고 오는 비동기 작업 처리.
    // 변경 값 빈 배열: 컴포넌트가 처음 렌더링 시 한 번만 실행됨. 이 의존성 배열에 값이 있을 경우 해당 값 변경 시마다 useEffect 훅 다시 실행됨.
    // axios 요청: 서버로 비동기 요청을 보냄.
    const [data, setData] = useState([]);
    const [errMsg, setErrMsg] = useState('');

    const [userInput, setUserInput] = useState('');
    // console.log(userInput);
    const getData = () => {
        axios
        .get('http://127.0.0.1:8000/api/data')
        .then(response => {
            console.log(`getData DB Data: ${JSON.stringify(response.data)}`);
            setData(response.data);
        })
        .catch(error => {
            setErrMsg(`getData error! ${error.message}`);
            alert(`getData error! ${error.message}`);
        })
    };
    
    const postData = () => {
        if (!userInput) {
            (console.log(`user input is Null or ''.`))
            return;
        }
        axios
        .post('http://127.0.0.1:8000/api/data/post/', { name: userInput })
        .then(() => {
            console.log(`PostData User Input Data: ${userInput}`);
            getData();
            setUserInput('');
        })
        .catch(error => {
            setErrMsg(`PostData error! ${error.message}`);
            alert(`PostData error! ${error.message}`);
            getData();
        });

    }
    useEffect(() => {
        getData();
    }, []);
    

    return (
        <div className='dataPostArea'>
            <Form.Control type='text' placeholder='이름을 입력하세요.' value={userInput} onChange={e => setUserInput(e.target.value)}/>
            <Button onClick={postData}>Click</Button>
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
                    {userInput}
                </div>
                )
            }
        </div>
    )
}
export default DataPost;