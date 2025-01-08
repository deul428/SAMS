import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from './api';

import roots from './datas/Roots';
import { Button, Form, Row, Col, FloatingLabel } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import '../styles/_search.scss';

const InputField = ({ v_componentName, v_propsData, setRes, setListData }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [endpoint, setEndpoint] = useState(null);

    // ================= POST ================= 

    // input field 값 input에 저장
    const f_handlingInput = (e) => {
        /* if (e.target.name === 'a_essential_achievement_tf') {
            e.target.checked ? e.target.value = true : e.target.value = false;
        } */
        const { name, value, type, checked } = e.target;
        setInput((prevInput) => ({
            ...prevInput,
            [name]: type === 'checkbox' ? checked : value, //e.target.name의 값을 키로, e.target.value를 값으로 사용
        }));
        /* const { name, value } = e.target;
        // input 업데이트
        setInput((prevInput) => {
            const newState = { ...prevInput, [name]: value.trim() };
            console.log("f_handlingInput 업데이트된 상태:", newState);
            return newState;
        }); */
    }        
    // -------------- 세션 대체용 userId 송신 -------------- 
    const auth = useSelector((state) => state.auth);
    // -------------- 세션 대체용 userId 송신 끝 -------------- 

    // post용 객체, input field value 저장해서 이후 서버로 송신
    let p_input = null;

    const p_bizopp = {
        a_session_user_id: auth.userId,
        a_contract_date_from: '',
        a_contract_date_to: '',
        a_sale_date_from: '',
        a_sale_date_to: '',
        a_progress_rate_code_from: '',
        a_progress_rate_code_to: '',
        a_essential_achievement_tf: false,
        a_headquarters_dept_id: '',
        a_dept_id: '',
        a_user_name: '',
    }
    const p_activity = {
        a_contract_date_from: '',
        a_contract_date_to: '',
        a_sale_date_from: '',
        a_sale_date_to: '',
        /* a_progress_rate_code_from: '',
        a_progress_rate_code_to: '',
        a_essential_achievement_tf: false, */
        a_headquarters_dept_id: '',
        a_dept_id: '',
        a_user_name: '',
    }
    // 초기값 동적으로 설정
    const getInitialInput = () => {
        if (v_componentName === 'bizOpp') return { ...p_bizopp };
        if (v_componentName === 'activity') return { ...p_activity };
        return {};
    };
    // 상태 초기화
    const [input, setInput] = useState(getInitialInput());
/* 
    const f_resetData = (msg) => {
        if (msg) { 
            const updatedInput = { ...input };
            setInput((input) => {
                // 현재 상태 복사
                Object.keys(updatedInput).forEach((key) => {
                  updatedInput[key] = ""; // 모든 키 초기화
                });
                updatedInput.a_session_user_id = auth.userId; // 특정 키 값 재할당
                return updatedInput; // 새로운 객체 반환
            });
            // f_submitData('post', endpoint, updatedInput);
            f_authLevel2('post', endpoint, updatedInput);
        } 
    } */

    const f_submitData = async (method, endpoint, input = null, e, msg) => {
        if (input) {
            console.log("-----------------input--------------", input);
        }
        if (e && e !== 'cancel') {
            e.preventDefault(); // submit 방지
        } 
        try {
            // 유효값 검사
            // 날짜 yyyy-mm-dd -> yyyymmdd
            const dateKeys = ['a_contract_date_to', 'a_contract_date_from', 'a_sale_date_from', 'a_sale_date_to'];
            dateKeys.forEach(key => {
                if (input[key]) {
                    return input[key] = input[key].replace(/-/g, '');
                }
            });  

            // 날짜: 1) to null 가능. 2) from > to일 경우 return
            if (!input.a_contract_date_to || input.a_sale_date_to) {
                // console.log("to 값이 null이거나 빈 문자열입니다."); // 디버깅용
            } else {
                if ((input.a_contract_date_from > input.a_contract_date_to) || (input.a_sale_date_from > input.a_sale_date_to)) {
                    alert('일자는 From보다 To가 더 작을 수 없습니다.');
                    return;
                }
            }
            console.log("submit 될 input data\n", input, e);
            const response = await apiMethods[method]('select-biz-opp2/', input);
            if (response.status?.STATUS === 'NONE' || response[0]?.STATUS === 'FAIL') {
                console.log(response.status?.STATUS, response.status?.MESSAGE);
                setRes(null);
                // v_handlingHtmlNone = response.status.MESSAGE;
                return;
            } else {
                console.log('input Field response 송신 완료', "\nendpoint: ", endpoint, "\nresponse: ", response);
                console.log(data)
                setRes(response);
                return response;
            }
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
        const { retrieve_biz_opp, ...v_filter } = v_propsData.data;
        switch(v_componentName) {
            case `bizOpp`: 
                setData(v_filter); // 상태 업데이트
                // setEndpoint(roots.bizopp.endpoint);
                setEndpoint('select-biz-opp2/');
                break;
            case `activity`: 
                setData(v_filter); // 상태 업데이트
                setEndpoint(roots.bizopp.endpoint);
                break;
            default:
                // console.log(v_componentName);
                break;
        }
        setInput(getInitialInput());
        // console.log("getInitialInput? ", input);
    }, [v_propsData, v_componentName]);
    // ================= get data 핸들링 끝 ================= 


    // ================= option 1 변경 시 2도 동적으로 변경 ================= 
    // --------- 본부별 팀 매핑 --------- 
    const [v_depts, setVDepts] = useState([]);
    const [v_teams, setVTeams] = useState([]);
    const [v_teamByDept, setVTeamByDept] = useState({});

    const f_teamLinkedDept = () => {
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
        // console.log(v_teamByDept);
    }

/* 
    useEffect(() =>{
        if (data.search_team) {
            if (auth.userDeptCode === '9801'){
                const head = data.search_headquarters[5];
                const team = data.search_team[8];
                setVDepts(head);
                setVTeams(team);
                console.log(data, head, team); // 업데이트 전 값을 바로 로그
                return;
            }
        }
    }, [data]) */

    // 디버깅용
/*     useEffect(() => {
        // console.log("v_depts:", v_depts, "\nv_teams:", v_teams);
        // console.log("v_teamByDept: ", v_teamByDept);
    }, [v_depts, v_teams,v_teamByDept]) */


    const [v_selectDept, setVSelectDept] = useState('');
    const [v_selectTeam, setVSelectTeam] = useState([]);

    // 본부 선택 핸들러
    const f_handlingDept = (e) => {
        console.log(e.target.name, e.target.value);
        if (e.target.name === 'a_headquarters_dept_id') {
            setVSelectDept(e.target.value);
            setVSelectTeam(v_teamByDept[e.target.value] || []);
        }
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
        setVSelectProTo(e.target.value);
        f_handlingInput(e);
    }
    // --------- From-to 매핑 끝 --------- 

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

    const [v_deptHandling, setVDeptHandling] = useState({
        deptValue: '',
        deptMsg: '-- 본부를 선택하세요 --',
        detpDisabled: true,
    })
    const [v_teamHandling, setVTeamHandling] = useState({
        teamValue: '',
        teamMsg: '-- 팀을 선택하세요 --',
        teamDisabled: true,
    })
    const [v_userHandling, setVUserhandling] = useState({
        userValue: '',
        userMsg: '-- 담당자를 선택하세요 --',
        userDisabled: true,
    })

    // 권한별 UI 
    // Level 1. 권한(AUT) Check 0001admin / 0002guest / 0003none
    const f_authLevel1 = () => {
        console.log("auth.userAuthCode: ", auth.userAuthCode);
        switch(auth.userAuthCode) {
            //1. admin
            case '0001' :
                // console.log('admin', data.search_headquarters, data.search_team);
                setVDepts(data.search_headquarters);
                setVTeams(data.search_team);
                // f_teamLinkedDept(); 
                setVDeptHandling((prevDept) => ({
                    ...prevDept,
                    detpDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                // setVDeptHandling()
                break;
            // 2. guest
            case '0002' :
                setVDepts(data.search_headquarters);
                setVTeams(data.search_team);
                // f_teamLinkedDept(); 
                setVDeptHandling((prevDept) => ({
                    ...prevDept,
                    detpDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                break;
            // 3. none
            case '0003' :
                f_authLevel2();
                break;
            default :
                alert('권한이 없습니다. 다시 로그인해 주세요.');
                break;
        }
    }


    // Level 2. 직책(RES) Check 0001팀원 0002팀장 0003본부장 0004이사
    const f_authLevel2 = () => {
        const resCode = auth.userResCode;
        console.log("auth.userResCode: ", resCode);
        switch(resCode) {
            case '0001' :
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userValue: auth.userName,
                }));
                console.log(input.a_user_name);
                setInput((prevInput) => ({
                    ...prevInput,
                    a_user_name: v_userHandling.userValue
                }))
                f_authLevel3('팀원');
                break;
            case '0002' :
                // setVUserhandling('');
                f_authLevel3('팀장');
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                break;
            case '0003' :
                // setVUserhandling('');
                f_authLevel3('본부장');
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                break;
            case '0004' :
                // setVUserhandling('');
                f_authLevel3('이사');
                setVDeptHandling((prevDept) => ({
                    ...prevDept,
                    detpDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                break;
            default :
                console.log(auth.userName);
                break;
        }
    }
    
    // Level 3. 부서(dept 테이블의 dept_id)
    /* 9201	경영관리팀
    9509	운영팀
    9711	영업1팀
    9712	영업2팀
    9713	영업3팀
    9721	전략사업1팀
    9722	전략사업2팀
    9723	전략사업3팀
    9801	신사업추진팀 */
    const f_authLevel3 = (userAuth2Data) => {
        let head, team;
        const deptId = auth.userDeptCode;
        console.log("auth.userDeptCode: ", deptId);
        switch(deptId) {
            case '9201' :
                head = [data.search_headquarters[1]];
                team = [data.search_team[0]];
                break;
            case '9509' :
                head = [data.search_headquarters[1]];
                team = [data.search_team[0]];
                break;
            case '9801' :
                head = [data.search_headquarters[5]];
                team = [data.search_team[8]];
                break;
            default :
                head = '';
                team = '';
                break;
        }
        if (userAuth2Data === '본부장') {
            setVTeams('');
            setVTeamHandling({
                teamValue: team[0].dept_name,
                teamMsg: team[0].dept_name,
                teamDisabled: false
            })
        } else {
            setVTeams(team);
            setVTeamHandling({
                teamValue: team[0].dept_name,
                teamMsg: team[0].dept_name,
                teamDisabled: true
            })
        }
        if (userAuth2Data === '이사') {
            setVTeams('');
            setVDeptHandling({
                deptValue : head[0].dept_name, 
                deptMsg : head[0].dept_name,
                detpDisabled: false,
            });
        } else {
            setVDeptHandling({
                deptValue : head[0].dept_name, 
                deptMsg : head[0].dept_name,
                detpDisabled: true,
            });
        }
        setVDepts(head);
        console.log("a_user_name:", input.a_user_name);
        setInput((prevInput) => ({
            ...prevInput,
            a_headquarters_dept_id: team[0].high_dept_id, 
            a_dept_id: team[0].dept_id,
            // a_user_name: v_userHandling.userValue
        }));
        console.log("a_user_name:", input.a_user_name);
        f_submitData('post', endpoint, input);
        // f_teamLinkedDept();
    }
    // 디버깅용
    useEffect(()=> {
        console.log(input);
    }, [input]);

    useEffect(() => {
        // console.log("=-=-==-=--=data:-=-=-=--=-", data);
        if (Object.keys(data).length > 0) {
            switch(v_componentName) {
                case 'bizOpp':
                    f_authLevel1();
                    break;
                case 'activity':
                    f_teamLinkedDept(); 
                    break;
                default: 
                    // console.log(v_componentName);
                    break;
            }
        }
    }, []);
    // ================= option 1 변경 시 2도 동적으로 변경 끝 ================= 


    /*     // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === "/login") {
                await dispatch(setLocation(location.pathname));
            }
        };

        syncPath();
    }, [currentPath, location.pathname, dispatch]); */


    // UI 업데이트
    useEffect(() => {
        // console.log("f_handlingInput 업데이트된 상태:", input);
        const updateUI = () => {
            /* if (!currentPath || currentPath === "/login") {
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
                                <>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={5} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='계약 일자 From'>
                                            <Form.Control type='date' size='sm' label='FROM' className='' name='a_contract_date_from' value={input?.a_contract_date_from || ''} onChange={f_handlingInput} // 값 변경 시 상태 업데이트
                                            />
                                        </FloatingLabel>
                                        <span style={{margin: '0 10px'}}>~</span>
                                        <FloatingLabel label='계약 일자 To'>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_contract_date_to' value={input?.a_contract_date_to || ''} onChange={f_handlingInput}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={5} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='매출 일자 From'>
                                            <Form.Control size='sm' type='date' label='FROM' className='' name='a_sale_date_from' value={input?.a_sale_date_from || ''} onChange={f_handlingInput}/>
                                        </FloatingLabel>
                                            <span style={{margin: '0 10px'}}>~</span>
                                        <FloatingLabel label='매출 일자 To'>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_sale_date_to' value={input?.a_sale_date_to || ''} onChange={f_handlingInput}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={2} lg={4} className='btnArea col d-flex justify-content-end floating'>
                                        <Button variant='info' onClick={(e) => f_submitData('post', endpoint, input, e, null)}>조회</Button>
                                        {/* <Button variant='dark' className='ms-2' onClick={(e) => f_resetData('cancel')}>초기화</Button> */}
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={5} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='진행률 From'>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_1 ' id='fromSelect' value={input?.a_progress_rate_code_from || ''} name='a_progress_rate_code_from' onChange={f_handleFromChange}>
                                                <option value=''>선택</option>
                                                {(Object.keys(data).length > 0 ? 
                                                    (
                                                        data.search_commonness_pro.map((e) => {
                                                            return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                        </FloatingLabel>
                                        <span style={{margin: '0 10px'}}>~</span>
                                        <FloatingLabel label='진행률 To'>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_2'  id='fromSelect' value={input?.a_progress_rate_code_to || ''} name='a_progress_rate_code_to' onChange={f_handleToChange}>
                                                <option value=''>선택</option>
                                                {(Object.keys(data).length > 0 ? 
                                                    (
                                                        v_filteredProTo.map((e) => {
                                                            return <option key={e.key} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <Form.Label htmlFor='inputChck' className=''>필달 여부</Form.Label>
                                        <Form.Check type={`checkbox`} id={`inputChck`} checked={input?.a_essential_achievement_tf || false} name='a_essential_achievement_tf' onChange={f_handlingInput}/>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='본부'>
                                            <Form.Select id='select1' size='sm' aria-label='selectBox' value={input?.a_headquarters_dept_id || ''} name='a_headquarters_dept_id' onChange={f_handlingDept} disabled={v_deptHandling.detpDisabled}>
                                                <option value={v_deptHandling.deptValue || ''}>{v_deptHandling.deptMsg || '-- 본부를 선택하세요 --'}</option>
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
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='팀'>
                                            <Form.Select id='select2' size='sm' aria-label='selectBox' name='a_dept_id' onChange={f_handlingDept} disabled={v_teamHandling.teamDisabled}>
                                                <option value={v_teamHandling.teamValue || ''}>{v_teamHandling.teamMsg || '-- 팀을 선택하세요 --'}</option>
                                                {v_selectTeam.map((team) => (
                                                    <option key={team.dept_id} value={team.dept_id || ''}>
                                                        {team.dept_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='영업 담당자'>
                                            <Form.Control size='sm' type='text' id='userName' defaultValue={v_userHandling.userValue || ''} name='a_user_name' onChange={f_handlingInput} disabled={v_userHandling.userDisabled}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                </>
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
                                <>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={5} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='계약 일자 From'>
                                            <Form.Control type='date' size='sm' label='FROM' className='' name='a_contract_date_from' value={input.a_contract_date_from || ''} onChange={f_handlingInput} // 값 변경 시 상태 업데이트
                                            />
                                        </FloatingLabel>
                                        <span style={{margin: '0 10px'}}>~</span>
                                        <FloatingLabel label='계약 일자 To'>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_contract_date_to' value={input.a_contract_date_to || ''} onChange={f_handlingInput}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={5} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='매출 일자 From'>
                                            <Form.Control size='sm' type='date' label='FROM' className='' name='a_sale_date_from' value={input.a_sale_date_from || ''} onChange={f_handlingInput}/>
                                        </FloatingLabel>
                                            <span style={{margin: '0 10px'}}>~</span>
                                        <FloatingLabel label='매출 일자 To'>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_sale_date_to' value={input.a_sale_date_to || ''} onChange={f_handlingInput}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={2} lg={4} className='btnArea col d-flex justify-content-end floating'>
                                        <Button variant='info' onClick={(e) => f_submitData('post', endpoint, input, e)}>조회</Button>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='본부'>
                                            <Form.Select id='select1' size='sm' aria-label='selectBox' value={input.a_headquarters_dept_id || ''} name='a_headquarters_dept_id' onChange={f_handlingDept}>
                                                <option>-- 본부를 선택하세요 --</option>
                                                {(Object.keys(data).length > 0 ? 
                                                (
                                                    (Array.isArray(v_depts)) ?
                                                    (v_depts.map((dept) => (
                                                    <option key={dept.dept_id} value={dept.dept_id}>
                                                        {dept.dept_name}
                                                    </option>
                                                    ))) 
                                                    :
                                                    (console.log(v_depts))
                                                )
                                                :
                                                ('')
                                                )}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='팀'>
                                            <Form.Select id='select2' size='sm' aria-label='selectBox' /* value={input.a_dept_id} */ name='a_dept_id' onChange={f_handlingDept} disabled={!v_selectTeam.length}>
                                                <option>-- 팀을 선택하세요 --</option>
                                                {v_selectTeam.map((team) => (
                                                    <option key={team.dept_id} value={team.dept_id || ''}>
                                                        {team.dept_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start floating'>
                                        <FloatingLabel label='영업 담당자'>
                                            <Form.Control size='sm' type='text' id='userName' value={input.a_user_name} name='a_user_name' onChange={f_handlingInput}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                </>




                                <div style={{"display":"none"}}>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={5} lg={5} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>계약 일자</Form.Label>
                                        <div className='d-flex'>
                                            <Form.Control type='date' size='sm' label='FROM' className='' name='a_contract_date_from' value={input.a_contract_date_from || ''} onChange={f_handlingInput} // 값 변경 시 상태 업데이트
                                            />
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_contract_date_to' value={input.a_contract_date_to || ''} onChange={f_handlingInput}/>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={5} lg={5} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>매출 일자</Form.Label>
                                        <div className='d-flex'>
                                            <Form.Control size='sm' type='date' label='FROM' className='' name='a_sale_date_from' value={input.a_sale_date_from || ''} onChange={f_handlingInput}/>
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Control size='sm' type='date' label='TO' className='' name='a_sale_date_to' value={input.a_sale_date_to || ''} onChange={f_handlingInput}/>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={2} lg={2} className='btnArea col d-flex justify-content-end'>
                                        <Button variant='info' onClick={(e) => f_submitData('post', endpoint, input, e)}>조회</Button>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={5} lg={5} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>진행률</Form.Label>
                                        <div>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_1 ' id='fromSelect' value={input.a_progress_rate_code_from || ''} name='a_progress_rate_code_from' onChange={f_handleFromChange}>
                                                <option>선택</option>
                                                {(Object.keys(data).length > 0 ? 
                                                    (
                                                        data.search_commonness_pro.map((e) => {
                                                            return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_2'  id='fromSelect' value={input.a_progress_rate_code_to || ''} name='a_progress_rate_code_to' onChange={f_handleToChange}>
                                                <option>선택</option>
                                                {(Object.keys(data).length > 0 ? 
                                                    (
                                                        v_filteredProTo.map((e) => {
                                                            return <option key={e.key} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={5} lg={5} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label htmlFor='inputChck' className=''>필달 여부</Form.Label>
                                        <Form.Check type={`checkbox`} id={`inputChck`}  value={input.a_essential_achievement_tf || false} name='a_essential_achievement_tf' onChange={f_handlingInput}/>
                                    </Col>
                                    <Col xs={12} md={2} lg={2} className='col d-flex align-items-center justify-content-start'>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-between'>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>본부</Form.Label>
                                        <Form.Select id='select1' size='sm' aria-label='selectBox' value={input.a_headquarters_dept_id || ''} name='a_headquarters_dept_id' onChange={f_handlingDept}>
                                            <option>-- 본부를 선택하세요 --</option>
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
                                        <Form.Select id='select2' size='sm' aria-label='selectBox' /* value={input.a_dept_id} */ name='a_dept_id' onChange={f_handlingDept} disabled={!v_selectTeam.length}>
                                            <option>-- 팀을 선택하세요 --</option>
                                            {v_selectTeam.map((team) => (
                                                <option key={team.dept_id} value={team.dept_id || ''}>
                                                    {team.dept_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className='col d-flex align-items-center justify-content-start'>
                                        <Form.Label className=''>영업 담당자</Form.Label>
                                        <Form.Control size='sm' type='text' placeholder='담당자명을 입력하세요' id='userName' /* value={input.a_user_name} */ name='a_user_name' onChange={f_handlingInput}/>
                                    </Col>
                                </Row>
                                </div>
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
    }, [data, input, v_depts, v_teams, v_selectDept, v_selectTeam, v_teamByDept, v_selectProFrom, v_selectProTo.

        v_deptHandling, v_teamHandling, v_userHandling
    ]);

    return (
        <div id='search' className='wrap'>
            {(data) ? 
                (v_handlingHtml) : ('')
            }
        </div>
    );
};

export default InputField;
