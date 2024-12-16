import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from './api';

import roots from './datas/Roots';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';

const InputField = ({ v_componentName, v_propsData }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [endpoint, setEndpoint] = useState(null);



    // ================= POST ================= 
    // post용 객체, input field value 저장해서 이후 서버로 송신
    const p_search = {
        a_contract_date_from: '',
        a_contract_date_to: '',
        a_sale_date_from: '',
        a_sale_date_to: '',
        a_commonness_pro_from: '',
        a_commonness_pro_to: '',
        a_essential_achievement_tf: false,
        a_sql_headquarters: '',
        a_team: '',
        a_username: '',
    }
    const [input, setInput] = useState(p_search);

    // input field 값 input에 저장
    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        if (e.target.name === 'a_essential_achievement_tf') {
            e.target.checked ? e.target.value = true : e.target.value = false;
        }
        // input 업데이트
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value.trim(),
        }));
        console.log({ name, value }, input);
    }     
    
    const f_submitLoginData = async (method, endpoint, input = null, e) => {
        e.preventDefault(); // submit 방지
        try {
            // 유효값 검사
            // ...

            console.log(input);

            /* const response = await apiMethods[method]('select-biz-opp2/', input);
            console.log('input Field response 송신 완료', endpoint, response);
            return response; */
        } catch (error) {
            console.log('Error during login:', error, `f_handlingData(${method}) error! ${error.message}`);
            alert('로그인 중 오류가 발생했습니다. 관리자에게 문의하세요.', error);
        }
    }

    // ================= POST 끝 ================= 

    // ================= get data 핸들링: bizopp에서 필요한 데이터 배열만 뽑아 오기 ================= 
    const [data, setData] = useState([]);
    // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
    useEffect(() => {
        if (!v_propsData || Object.keys(v_propsData).length === 0) {
            console.warn('v_propsData가 비어 있습니다.');
            return;
        }
        switch(v_componentName) {
            case `bizOpp`: 
                setEndpoint(roots[4].endpoint);
                const { retrieve_biz_opp, ...v_filter } = v_propsData.data;
                setData(v_filter); // 상태 업데이트
                break;
            case `activity`: 
                
                break;
            default:
                console.log(v_componentName);
                break;
        }
    }, [v_propsData]);
    // ================= get data 핸들링 끝 ================= 


    // ================= option 1 변경 시 2도 동적으로 변경 ================= 
    // --------- 본부별 팀 매핑 --------- 
    const [v_depts, setVDepts] = useState([]);
    const [v_teams, setVTeams] = useState([]);
    const [v_teamByDept, setVTeamByDept] = useState({});

    const f_teamLinkedDept = () => {
        setVDepts(data.search_headquarters);
        setVTeams(data.search_team);

        // 본부별 팀 그룹화 - acc에 high_dept_id가 없을 경우 생성
        const f_mapping = data.search_team.reduce((acc, items) => {
            const { high_dept_id } = items;
            if (!acc[high_dept_id]) {
                acc[high_dept_id] = [];
            }
        acc[high_dept_id].push(items);
            return acc;
        }, {});

        setVTeamByDept(f_mapping);
    }

    const [v_selectDept, setVSelectDept] = useState('');
    const [v_selectTeam, setVSelectTeam] = useState([]);

    // 본부 선택 핸들러
    const f_handlingDept = (e) => {
        setVSelectDept(e.target.value);
        setVSelectTeam(v_teamByDept[e.target.value] || []);
        f_handlingInput(e);
    };
    // --------- 본부별 팀 매핑 끝 --------- 

    
    // --------- From-to 매핑 --------- 
    const [v_selectProFrom, setVSelectProFrom] = useState([]);
    const [v_selectProTo, setVSelectProTo] = useState([]);
    const [v_filteredProTo, setVFilteredProTo] = useState([]);
    
    const f_handleFromChange = (e) => {
        setVSelectProFrom(e.target.value);
        setVFilteredProTo(data.search_commonness_pro.filter((item) => parseInt(item.small_classi_code) > parseInt(e.target.value)));
        setVSelectProTo('');
        f_handlingInput(e);
    }
    const f_handleToChange = (e) => {
        console.log(e.target.value);
        setVSelectProTo(e.target.value);
        f_handlingInput(e);
    }
    // --------- From-to 매핑 끝 --------- 

    // --------- 날짜 --------- 
/*     const [startDate, setStartDate] = useState(''); // 시작 날짜 상태
    const [endDate, setEndDate] = useState(''); // 종료 날짜 상태 */

    // --------- 날짜 끝 --------- 


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

    useEffect(() => {
        if (Object.keys(data).length > 0) {
            switch(v_componentName) {
                case 'bizOpp':
                    f_teamLinkedDept(); 
                    break;
                default: 
                    console.log(v_componentName);
                    break;
            }
        }
    }, [data]);
    
    // UI 업데이트
    useEffect(() => {
        const updateUI = () => {
            /* if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            } */
            switch (v_componentName) {
                // biz-opp/
                case `bizOpp`:
                    setVHandlingHtml(
                        <>
                        <div className='inputField'>
                            <div className='searchItem'>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={12} lg={5} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>계약 일자</Form.Label>
                                        <div>
                                            <Form.Control type='date' size='sm' label='FROM' className='' name='a_contract_date_from' value={input.a_contract_date_from} onChange={f_handlingInput} // 값 변경 시 상태 업데이트
                                            />
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_contract_date_to' value={input.a_contract_date_to} onChange={f_handlingInput}/>
                                            <span style={{margin: '0 10px'}}>~</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={12} lg={5} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>매출 일자</Form.Label>
                                        <div>
                                            <Form.Control size='sm' type='date' label='FROM' className='' name='a_sale_date_from' value={input.a_sale_date_from} onChange={f_handlingInput}/>
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_sale_date_to' value={input.a_sale_date_to} onChange={f_handlingInput}/>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={2} lg={2} className='btnArea col d-flex align-items-center justify-content-end'>
                                        <Button variant='info btnLeft' onClick={(e) => f_submitLoginData('post', endpoint, input, e)}>조회</Button>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>진행률</Form.Label>
                                        <div>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_1' id='fromSelect' value={input.a_commonness_pro_from} name='a_commonness_pro_from' onChange={f_handleFromChange}>
                                                <option>선택</option>
                                                {(Object.keys(data).length > 0 ? 
                                                    (
                                                        data.search_commonness_pro.map((e) => {
                                                            return <option value={e.small_classi_code}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_2'  id='fromSelect' value={input.a_commonness_pro_to} name='a_commonness_pro_to' onChange={f_handleToChange}>
                                                <option>선택</option>
                                                {(Object.keys(data).length > 0 ? 
                                                    (
                                                        v_filteredProTo.map((e) => {
                                                            return <option value={e.small_classi_code}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label for='inputChck' className=''>필달 여부</Form.Label>
                                        <Form.Check type={`checkbox`} id={`inputChck`}  value={input.a_essential_achievement_tf} name='a_essential_achievement_tf' onChange={f_handlingInput}/>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>본부</Form.Label>
                                        <Form.Select id='select1' size='sm' aria-label='selectBox' value={input.a_sql_headquarters} name='a_sql_headquarters' onChange={f_handlingDept}>
                                            <option value=''>-- 본부를 선택하세요 --</option>
                                            {(Object.keys(data).length > 0 ? 
                                            (
                                                v_depts.map((dept) => (
                                                <option key={dept.dept_id} value={dept.dept_id}>
                                                    {dept.dept_name}
                                                </option>
                                                ))
                                            )
                                            :
                                            ('')
                                            )}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>팀</Form.Label>
                                        <Form.Select id='select2' size='sm' disabled={!v_selectTeam.length}  value={input.a_team} name='a_team' onChange={f_handlingDept}>
                                            <option value=''>-- 팀을 선택하세요 --</option>
                                            {v_selectTeam.map((team) => (
                                                <option key={team.dept_id} value={team.dept_id}>
                                                    {team.dept_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>영업 담당자</Form.Label>

                                        <Form.Control size='sm' type='text' placeholder='담당자명을 입력하세요' id='userName' /* value={input.a_username} */ name='a_username' onChange={f_handlingInput}/>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        </>
                    );
                    break;
                case `activity`:
                    setVHandlingHtml(
                        <>
                            <div className='inputField'>
                                <div className='searchItem'>
                                    <Row className='d-flex justify-content-between'>
                                        <Col xs={12} md={12} lg={5} className='col d-flex align-items-center justify-content-start'>
                                            <Form.Label className=''>계약 일자</Form.Label>
                                            <div>
                                                <Form.Control size='sm' type='date' label='FROM' className='' name='' value=''/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size='sm' type='date' />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={12} lg={5} className='col d-flex align-items-center justify-content-start'>
                                            <Form.Label className=''>매출 일자</Form.Label>
                                            <div>
                                                <Form.Control size='sm' type='date' label='FROM' className='' name='' value=''/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size='sm' type='date' />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={2} lg={2} className='btnArea col d-flex align-items-center justify-content-end'>
                                            <Button variant='info btnLeft'>조회</Button>
                                        </Col>
                                    </Row>
                                    <Row className='d-flex justify-content-between'>
                                        <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                            <Form.Label className=''>본부</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                            <Form.Label className=''>팀</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                            <Form.Label className=''>영업 담당자</Form.Label>
                                            <Form.Control size='sm' type='text' placeholder='Default input' />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </>
                    );
                    break;
                   
                default:
                    setVHandlingHtml(<h1>안녕하세요 InputField.js 작업 중입니다.</h1>);
            }
        };

        updateUI();
    }, [/* currentPath,  */data, v_depts, v_selectTeam, v_selectProFrom, v_selectProTo, input]);

    return (
        <div id='search' className='wrap'>
            {v_handlingHtml}
        </div>
    );
};

export default InputField;
