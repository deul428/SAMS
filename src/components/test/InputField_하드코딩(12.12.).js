import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../redux/reducers/LocationSlice';
import { apiMethods } from '../../utils/api';

import roots from '../../utils/datas/Roots';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';

const InputField = ({ v_componentName, v_propsData }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

    if(v_componentName === 'bizOpp') {
        console.log("v_componentName: ", v_componentName);
    }
    const p_search = {
        a_v_sql_headquarters: '',
        a_team: '',
        a_commonness_pro: '',
        a_username: '',
        /* a_user_id: '',
        a_cipher: '', */
    }
    const [input, setInput] = useState(p_search);

    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        // input 업데이트
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value.trim(),
        }));
    }

    const [options, setOptions] = useState([]);
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');

    const optionMapping = {
        "1000000": [''],
        "1100000": [''],
        "1110000": ["1110100", "1110200"],
        "1120000": ["1120100", "1120200", "1120300"],
        "1130000": ["1130100", "1130200", "1130300"],
        "1140000": ["1140100", "1140200"],
        "1150000": ["1150100"],
    };
    const handleSelect1Change = (e) => {
        const selectedValue = e.target.value;
        console.log("Selected Value:", selectedValue); // 디버깅 로그 추가
        setOption1(selectedValue);
    
        const newOptions = optionMapping[selectedValue] || [];
        console.log("New Options:", newOptions); // 디버깅 로그 추가
        setOptions(newOptions);
        setOption2(""); // 두 번째 select 초기화
    };
    
      const handleSelect2Change = (e) => {
        setOption2(e.target.value);
    };

    const deptSelectDynamic = () => {
        if (data.length > 0) {
            data[2].map((e) => {
                return <option value={e.small_classi_code}>{e.small_classi_name}</option>
            })
        } else {
    
            console.log('data Loading')
        }
    }

    const [data, setData] = useState([ ]);
    // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
    useEffect(() => {
        if (!v_propsData || v_propsData.length === 0 || !v_propsData[0][3]) {
        console.warn("v_propsData가 비어 있습니다.");
        return;
        }
        const updatedData = v_propsData[0].slice(0, -1);
        console.log("업데이트된 데이터:", updatedData);

        setData(updatedData); // 상태 업데이트
    }, [v_propsData]);
    useEffect(() => {
        console.log("Current Option1:", option1);
        console.log("Options for Select2:", options);
    }, [option1, options]);
/*     // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === '/login' || currentPath === '/login/') {
                await dispatch(setLocation(location.pathname)); // Redux 상태 업데이트를 보장
            }
        };
        syncPath();
    }, [currentPath, location.pathname, dispatch]);
    
    console.log(currentPath); */

    

    // UI 업데이트
    useEffect(() => {
        // if (data.length > 0 ) {
        //     data[2].map((e) => {
        //         console.log(e.small_classi_name);
        //     })
        // } 
        const updateUI = () => {
            if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            }
            console.log("option1: ", option1, "\noption2: ", option2);

            switch (currentPath) {
                // biz-opp/
                case `/${roots.bizoppSelect1.depth1}/`:
                    setVHandlingHtml(
                        <>
                            <div className='inputField'>
                                <div className='searchItem'>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">계약 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span>
                                                <Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">매출 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span>
                                                <Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={2} lg={2} className='btnArea col d-flex align-items-center justify-content-end'>
                                            <Button variant='info btnLeft'>조회</Button>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">진행률</Form.Label>
                                            <div>
                                                <Form.Select size='sm' aria-label='selectBox' className='pro_1'>
                                                    <option>선택</option>
                                                    {(data.length > 0 ? 
                                                        (
                                                            data[2].map((e) => {
                                                                return <option value={e.small_classi_code}>{e.small_classi_name}</option>
                                                            })
                                                        )
                                                        :
                                                        (console.log('data Loading'))
                                                    )}
                                                </Form.Select>
                                                <span style={{margin: '0 10px'}}>~</span>
                                                <Form.Select size='sm' aria-label='selectBox' className='pro_2'>
                                                    <option>선택</option>
                                                    {(data.length > 0 ? 
                                                        (
                                                            data[2].map((e) => {
                                                                return <option value={e.small_classi_code}>{e.small_classi_name}</option>
                                                                // ()
                                                            })
                                                        )
                                                        :
                                                        (console.log('data Loading'))
                                                    )}
                                                </Form.Select>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label for='inputChck' className="">필달 여부</Form.Label>
                                            <Form.Check type={`checkbox`} id={`inputChck`}/>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">본부</Form.Label>
                                            <Form.Select id="select1" value={option1} onChange={handleSelect1Change} size='sm' aria-label='selectBox'>
                                                <option value="">-- Select an option --</option>
                                                <option value="1000000">1000000</option>
                                                <option value="1100000">1100000</option>
                                                <option value="1110000">1110000</option>
                                                <option value="1120000">1120000</option>
                                                <option value="1130000">1130000</option>
                                                <option value="1140000">1140000</option>
                                                <option value="1150000">1150000</option>

{/*                                                 
        "1000000": [''],
        "1100000": [''],
        "1110000": ["1110100", "1110200"],
        "1120000": ["1120100", "1120200", "1120300"],
        "1130000": ["1130100", "1130200", "1130300"],
        "1140000": ["1140100", "1140200"],
        "1150000": ["1150100"], */}
                                                {/* {(data.length > 0 ? 
                                                    (
                                                        data[0].map((e, index) => {
                                                            return <option value={e.dept_id}>{e.dept_name}</option>
                                                        })
                                                    )
                                                    :
                                                    (console.log('data Loading'))
                                                )} */}
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">팀</Form.Label>
                                            <Form.Select id='select2' value={option2} onChange={handleSelect2Change} size='sm' aria-label='selectBox' disabled={options.length === 0}>
                                            {/* disabled={options.length === 0} */}
                                            <option value="">-- Select an option --</option>
                                                {options.length > 0 &&
                                                    options.map((option, index) => (
                                                        <option key={index} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                {/* {(data.length > 0 ? 
                                                    (
                                                        data[1].map((e) => {
                                                            return <option value={e.dept_id}>{e.dept_name}</option>
                                                        })
                                                    )
                                                    :
                                                    (console.log('data Loading'))
                                                )} */}
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className=''>영업 담당자</Form.Label>
                                            <Form.Control size='sm' type='text' placeholder='담당자명을 입력하세요.' value={input.a_username}/>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </>
                    );
                    break;
                /* case `/${roots.bizoppHistory.depth1}/`:
                    setVHandlingHtml(
                        <>
                            <div className='inputField'>
                                <div className='searchItem'>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">계약 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">매출 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={2} lg={2} className='btnArea col d-flex align-items-center justify-content-end'>
                                            <Button variant='info btnLeft'>조회</Button>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">본부</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">팀</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className=''>영업 담당자</Form.Label>
                                            <Form.Control size='sm' type='text' placeholder='Default input' />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </>
                    );
                    break;
                     */
                default:
                    setVHandlingHtml(<h1>안녕하세요 InputField.js 작업 중입니다.</h1>);
            }
        };

        updateUI();
    }, [currentPath, data, option1, option2]);

    return (
        <div id='search' className='wrap'>
            {v_handlingHtml}
        </div>
    );
};

export default InputField;
