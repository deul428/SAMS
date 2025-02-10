import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from './api';

import Trees from './Trees';

import roots from './datas/Roots';
import '../styles/_customModal.scss';
import '../styles/_search.scss';
import { Modal, Button, Form, Row, Col, ListGroup, FloatingLabel } from 'react-bootstrap';
import { FileArrowDownFill, Search } from 'react-bootstrap-icons';

const InputFieldDetail = ({ show, onHide, v_componentName, v_propsData, v_modalPropsData, authLevel, setIsRefresh}) => {
    // v_propsData: inputField에서 받아오는 list 포함 데이터 / v_modalPropsData: dynamicTable에서 받아오는 테이블 데이터, 사용자가 선택한 행의 데이터만 불러옴
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [endpoint, setEndpoint] = useState(null);
    
    // ================= 사업 기회 조회 테이블부 핸들링 ================= 
    // -------------- 세션 대체용 userId 송신 -------------- 
    const auth = useSelector((state) => state.auth);
    // -------------- 세션 대체용 userId 송신 끝 -------------- 

    // ----------------- 1) 등록 및 수정 input 기본값 핸들링 -----------------
    // ..................... post용 객체, input field value 저장해서 이후 서버로 송신 ..................... 
    // 250106 전달해야 할 파라미터 키
    /* 1. 'biz_opp' Table
    biz_opp_name
    progress2_rate_code
    contract_date
    essential_achievement_tf

    2. 'biz_opp_detail' Table
    user_id
    change_preparation_dept_id
    last_client_com2_code
    sale_com2_code
    sale_item_no
    sale_date
    sale_amt
    sale_profit
    purchase_date
    purchase_amt
    collect_money_date
    biz_section2_code
    principal_product2_code

    3. 'biz_opp_activity' Table
    activity_details
    activity_date */
    // 250106 전달해야 할 파라미터 키 끝

    const p_bizopp = {
        a_session_user_id: auth.userId,
        a_user_name: (auth.userAuthCode === '0003' && auth.userResCode === '0001') ?
        auth.userName : '',
        biz_opp: { 
            a_biz_opp_name: '',
            a_progress2_rate_code: '',
            a_contract_date: '',
            a_essential_achievement_tf: false,
        },
        biz_opp_detail: {
            a_change_preparation_dept_id: auth.userAuthCode === '0003' ? auth.userDeptCode : '',
            a_last_client_com2_code: '',
            a_sale_com2_code: '',
            a_sale_item_no: '',
            a_sale_date: '',
            a_sale_amt: "0",
            a_sale_profit: "0",
            a_purchase_date: '',
            a_purchase_amt: "0",
            a_collect_money_date: '',
            a_biz_section2_code: '',
            a_principal_product2_code: '',
        },
        biz_opp_activity: {
            a_activity_details: '',
            a_activity_date: '',
        }
    }
    const [insertInput, setInsertInput] = useState(p_bizopp);
    // 변화 감지 추출
    const [updateInput, setUpdateInput] = useState([]);


    const [v_teamByDept, setVTeamByDept] = useState({});
    
    // const [v_selectDept, setVSelectDept] = useState('');
    const [v_selectTeam, setVSelectTeam] = useState([]);
    // 본부 선택 핸들러
    const f_handlingDept = (e) => {
        if (e.target.name === 'a_headquarters_dept_id') {
            // setVSelectDept(e.target.value);
            setVSelectTeam(v_teamByDept[e.target.value.trim()] || []);
        }
        f_handlingInput(e);
    };
    const [v_depts, setVDepts] = useState([]);
    const [v_deptHandling, setVDeptHandling] = useState({
        deptValue: '',
        deptMsg: '-- 본부를 선택하세요 --',
        deptDisabled: true,
    })
    const [v_teamHandling, setVTeamHandling] = useState({
        teamValue: '',
        teamMsg: '-- 팀을 선택하세요 --',
        teamDisabled: true,
    })
    const [v_userHandling, setVUserHandling] = useState({
        userValue: '',
        userMsg: '',
        userDisabled: true,
    })

    const authCheck = () => {
        let dept, team;
        const deptId = auth.userDeptCode;
        if (deptId.length === 4) {
            switch(deptId) {
                case '9109' :
                    dept = [v_propsData.data.search_headquarters[0]];
                    team = [v_propsData.data.search_team[0]];
                    break;
                case '9201' :
                    dept = [v_propsData.data.search_headquarters[1]];
                    team = [v_propsData.data.search_team[1]];
                    break;
                case '9509' :
                    dept = [v_propsData.data.search_headquarters[2]];
                    team = [v_propsData.data.search_team[2]];
                    break;
                case '9711' :
                    dept = [v_propsData.data.search_headquarters[3]];
                    team = [v_propsData.data.search_team[3]];
                    break;
                case '9712' :
                    dept = [v_propsData.data.search_headquarters[3]];
                    team = [v_propsData.data.search_team[4]];
                    break;
                case '9713' :
                    dept = [v_propsData.data.search_headquarters[3]];
                    team = [v_propsData.data.search_team[5]];
                    break;
                case '9721' :
                    dept = [v_propsData.data.search_headquarters[4]];
                    team = [v_propsData.data.search_team[6]];
                    break;
                case '9722' :
                    dept = [v_propsData.data.search_headquarters[4]];
                    team = [v_propsData.data.search_team[7]];
                    break;
                case '9723' :
                    dept = [v_propsData.data.search_headquarters[4]];
                    team = [v_propsData.data.search_team[8]];
                    break;
                case '9801' :
                    dept = [v_propsData.data.search_headquarters[5]];
                    team = [v_propsData.data.search_team[9]];
                    break;
                default :
                    break;
            }
        } else if (deptId.length === 5) {
            switch(deptId) {
                case '91000' :
                    dept = [v_propsData.data.search_headquarters[0]];
                    team = '';
                    break;
                case '92000' :
                    dept = [v_propsData.data.search_headquarters[1]];
                    team = [v_propsData.data.search_team[1]];
                    break;
                case '95000' :
                    dept = [v_propsData.data.search_headquarters[2]];
                    team = [v_propsData.data.search_team[2]];
                    break;
                case '97100' :
                    dept = [v_propsData.data.search_headquarters[3]];
                    team = '';
                    break;
                case '97200' :
                    dept = [v_propsData.data.search_headquarters[4]];
                    team = '';
                    break;
                case '98000' :
                    dept = [v_propsData.data.search_headquarters[5]];
                    team = [v_propsData.data.search_team[9]];
                    break;
                default :
                    break;
            } 
        } else {
            dept = '';
            team = '';
            console.log('no dept, no team');
        }
        // console.log("dept: ", dept, "team: ", team);

        // 본부별 팀 그룹화 - acc에 high_dept_id가 없을 경우 생성
        const mappingTeamByDept = v_propsData.data.search_team.reduce((acc, items) => {
            const { high_dept_id } = items;
            if (!acc[high_dept_id]) {
                acc[high_dept_id] = [];
            }
        acc[high_dept_id].push(items);
            return acc;
        }, {});

        /* const mappingTeamByDept = v_propsData.data.search_team.reduce((acc, items) => {
            const { change_preparation_high_dept_id } = items;
            if (!acc[change_preparation_high_dept_id]) {
                acc[change_preparation_high_dept_id] = [];
            }
        acc[change_preparation_high_dept_id].push(items);
            return acc;
        }, {}); */

        // console.log("mappingTeamByDept: ", mappingTeamByDept);
        setVTeamByDept(mappingTeamByDept);

        switch(auth.userAuthCode) {
            //1. admin
            case '0001' :
                if (detailData) {
                    setVDepts(detailData?.data?.search_dept_id);
                }
                setVDeptHandling((prevDept) => ({
                    ...prevDept,
                    deptDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                setVUserHandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                // O
                break;
            // 2. guest
            case '0002' :
                if (detailData) {
                    setVDepts(detailData?.data?.search_dept_id);
                }
                setVDeptHandling((prevDept) => ({
                    ...prevDept,
                    deptDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                setVUserHandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                break;
            // 3. none
            case '0003' :
                switch(auth.userResCode) {
                    case '0001':
                        setVTeamHandling({
                            teamValue: team[0].dept_id,
                            teamMsg: team[0].dept_name,
                            teamDisabled: true
                        })
                        setVDeptHandling({
                            deptValue: dept[0].dept_id,
                            deptMsg: dept[0].dept_name,
                            deptDisabled: true,
                        });
                        setVUserHandling({
                            userValue: auth.userId,
                            userMsg: auth.userName,
                            userDisabled: true,
                        });
                        break;
                    case '0002': 
                        setVTeamHandling({
                            teamValue: team[0].dept_id,
                            teamMsg: team[0].dept_name,
                            teamDisabled: true
                        })
                        setVDeptHandling({
                            deptValue: dept[0].dept_id,
                            deptMsg: dept[0].dept_name,
                            deptDisabled: true,
                        });
                        setVUserHandling((prevDept) => ({
                            ...prevDept,
                            userDisabled: false,
                        }));
                        break;
                    case '0003':
                        // f_teamLinkedDept();
                        const myTeam = mappingTeamByDept[auth.userDeptCode];
                        setVDepts(myTeam);
                        setVUserHandling((prevDept) => ({
                            ...prevDept,
                            userDisabled: false,
                        }));
                        if (team) {
                            setVTeamHandling({
                                teamValue: team[0].dept_id,
                                teamMsg: team[0].high_dept_name,
                            })
                        } else {
                            setVTeamHandling((team) => ({
                                ...team,
                                teamValue: dept[0].dept_id,
                                // teamMsg: dept[0].dept_name,
                            }))
                        }
                        setVDeptHandling({
                            deptValue: dept[0].dept_id,
                            deptMsg: dept[0].dept_name,
                        });
                        break;
                    default :
                        break;
                }
                break;
            default :
                alert('권한이 없습니다. 다시 로그인해 주세요.');
                break;
        }
        
    }
    // input field 값 input에 저장
    /*  24.12.26. 기준
        input: UI 업데이트를 위함. 날짜 및 금액 정규식 들어감.
        updateInput: 실제로 백엔드에 전송될 데이터. 

        25.01.08. 기준
        input: insert용. 초기값(빈값 포함)이 들어가 있음. 등록 시 백엔드에 전송될 데이터.
        updateInput: update용. 초기값이 없기 때문에([]) 변화가 감지된 부분만 저장. 수정 시 백엔드에 전송될 데이터.
    */
    const f_handlingInput = (e) => {
        const { name, value, type, checked, dataset } = e.target;
        const tableLevel = dataset.key; 
        const valueLevel = type === 'checkbox' ? checked : value.trim();
    
        if (e.target.name === 'a_progress2_rate_code' && (e.target.value === '0006' || e.target.value === '0007')) {
            setIsProDisabled(false);
        }

        const updateValue = (setState) => {
            setState((prevInput) => {
                // 필드가 disabled일 경우(수정 불가능할 경우), input에 값을 자동으로 채워 넣음. 그렇지 않을 경우 사용자가 입력한 input을 채워 넣음. < 해야 함
                let updatedInput;
                // 수정 시
                if (a_v_modalPropsData) {
                    updatedInput = { 
                        ...prevInput, 
                        a_session_user_id: auth.userId,
                        a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id,
                        a_detail_no: a_v_modalPropsData.a_detail_no,
                        a_user_name: prevInput.a_user_name
                    }
                } else {
                    updatedInput = { 
                        ...prevInput, 
                        a_session_user_id: auth.userId,
                    }
                }
                if (tableLevel) {
                    updatedInput[tableLevel] = {
                        ...updatedInput[tableLevel],
                        [name]: valueLevel, 
                    };
                } else {
                    // 최상위 키로 업데이트
                    updatedInput[name] = valueLevel;
                }
                return updatedInput; 
            })
        }
        updateValue(setInsertInput);
        updateValue(setUpdateInput);
    };
    
/*     useEffect(() => {
        console.log("input: ", insertInput, "\n\nchangeInput: ", updateInput);
    }, [insertInput, updateInput]); */
    // ..................... post용 객체, input field value 저장해서 이후 서버로 송신 끝 .....................
    // ----------------- 1) 등록 및 수정 input 핸들링 끝 -----------------

    // ----------------- 2) 수정 시 핸들링 -----------------
    // 1. post용
    // 키에 접두어 'a_' 삽입, a_v_modalPropsData로 가공 
    let a_v_modalPropsData;
    if(v_modalPropsData) {
        a_v_modalPropsData = Object.fromEntries(
            Object.entries(v_modalPropsData).map(([key, value]) => [`a_${key}`, value])
        );
        const a = a_v_modalPropsData;
        
        var p_bizopp_delete = {
            a_biz_opp_id: a.a_biz_opp_id,
            /* a_biz_opp_name: a.a_biz_opp_name,
            a_progress1_rate_code: a.a_progress1_rate_code,
            a_progress2_rate_code: a.a_progress2_rate_code,
            a_contract_date: a.a_contract_date,
            a_essential_achievement_tf: a.a_essential_achievement_tf, */
            a_detail_no: a.a_detail_no,
            /* a_user_id: a.a_user_id,
            a_change_preparation_dept_id: a.a_change_preparation_dept_id,
            a_change_preparation_dept_name: a.a_change_preparation_dept_name,
            a_last_client_com1_code: a.a_last_client_com1_code,
            a_last_client_com2_code: a.a_last_client_com2_code,
            a_sale_com1_code: a.a_sale_com1_code,
            a_sale_com2_code: a.a_sale_com2_code,
            a_sale_item_no: a.a_sale_item_no,
            a_sale_date: a.a_sale_date,
            a_sale_amt: a.a_sale_amt,
            a_sale_profit: a.a_sale_profit,
            a_purchase_date: a.a_purchase_date,
            a_purchase_amt: a.a_purchase_amt,
            a_collect_money_date: a.a_collect_money_date,
            a_biz_section1_code: a.a_biz_section1_code,
            a_biz_section2_code: a.a_biz_section2_code,
            a_principal_product1_code: a.a_principal_product1_code,
            a_principal_product2_code: a.a_principal_product2_code, */
        }
    }
    // 2. UI 표현용
    useEffect(() => {
        // a_v_modalPropsData 데이터 핸들링 후 input 객체에 복사
        if (v_modalPropsData) {
            // 판품번호 disabled 제어
            if (v_modalPropsData.progress2_rate_code === '0006' || v_modalPropsData.progress2_rate_code === '0007') {
                setIsProDisabled(false);
            } else {
                setIsProDisabled(true);
            }
            // ..................... 날짜 위젯과 매핑 YYYYMMDD -> YYYY-MM-DD .....................
            const dateKeys = ['a_sale_date', 'a_collect_money_date', 'a_purchase_date', 'a_contract_date', 'a_activity_date'];
            dateKeys.forEach(key => {
                if (a_v_modalPropsData[key]) {
                    return a_v_modalPropsData[key] = a_v_modalPropsData[key].replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
                }
            });
            // ..................... 날짜 위젯과 매핑 YYYYMMDD -> YYYY-MM-DD 끝 .....................
            // ..................... 숫자 문자열로 변환 후 쉼표 추가 ..................... 
            const numKeys = ['a_purchase_amt', 'a_sale_amt', 'a_sale_profit'];
            numKeys.forEach(key => {
                if (a_v_modalPropsData[key]) {
                    return a_v_modalPropsData[key] = a_v_modalPropsData[key].toLocaleString('ko-KR');
                }
            });
            // ..................... 숫자 문자열로 변환 후 쉼표 추가 끝 ..................... 
            
            // input, changeInput에 a_v_modalPropsData.a_biz_opp_id 추가
            setInsertInput((prevInput) => {
                const insertedInput = { 
                    ...prevInput, 
                    a_session_user_id: auth.userId,
                
                };
                /* updatedInput.biz_opp = {
                    ...prevInput.biz_opp,
                } */
                return insertedInput;
            });
            setUpdateInput((prevInput) => {
                const updatedInput = { 
                    ...prevInput, 
                    a_session_user_id: auth.userId,
                    a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id,
                    a_detail_no: a_v_modalPropsData.a_detail_no,
                    a_user_name: a_v_modalPropsData.a_user_name,
                };
                /* updatedInput.biz_opp = {
                    ...prevInput.biz_opp,
                    a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id,
                }
                updateInput.biz_opp_detail = {
                    ...prevInput.biz_opp_detail,
                    a_detail_no: a_v_modalPropsData.a_detail_no,
                } */
                return updatedInput; 
            });
        } 
    }, [v_modalPropsData]);
    // ----------------- 2) 수정 시 핸들링 끝 -----------------
    // ================= 사업 기회 조회 테이블부 핸들링 끝 ================= 

    // ================= POST ================= 
    const [detailData, setDetailData] = useState(null);
    const [activityData, setActivityData] = useState(null);
    const f_handlingData = async (method, endpoint, input = null, e, msg) => {
        let confirmMsg;
        let confirmResult = true;

        if (msg === '활동조회' && a_v_modalPropsData) {
            input = { 
                a_session_user_id: input.a_session_user_id, 
                a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id, 
                a_detail_no: a_v_modalPropsData.a_detail_no 
            };
        } else if (msg === '삭제' && a_v_modalPropsData) {
            if (v_componentName === 'bizOpp') {
                input = { 
                    a_session_user_id: input.a_session_user_id, 
                    a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id, 
                    a_detail_no: a_v_modalPropsData.a_detail_no 
                };
                confirmMsg = `정말 ${input.a_biz_opp_id}번 사업 (기회)를 삭제하시겠습니까?`
            } else if (v_componentName === 'activity') {
                input = { 
                    a_session_user_id: input.a_session_user_id, 
                    a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id, 
                    a_detail_no: a_v_modalPropsData.a_detail_no,
                    a_activity_no: a_v_modalPropsData.a_detail_no 
                };
                confirmMsg = `해당 영업 활동 내역을 삭제하시겠습니까?`

            }
        } 
            /* const updatedInput = f_warningMsg(); // 반환값을 변수에 저장
            if (!updatedInput) {
                // console.log("삭제 작업이 취소되었습니다."); // 취소 로그
                return; // 삭제 취소 시 이후 코드 실행 중단
            }
            input = updatedInput; // Confirm이 true일 때만 input 업데이트
        } */

        if (input && e && (msg === '등록' || msg === '수정')) {
            e.preventDefault(); 
            const dateKeysMap = {
                biz_opp: ['a_contract_date'],
                biz_opp_detail: ['a_purchase_date', 'a_sale_date', 'a_collect_money_date'],
                biz_opp_activity: ['a_activity_date']
            };
            
            Object.entries(dateKeysMap).forEach(([section, keys]) => {
                if (input[section]) {
                    keys.forEach((key) => {
                        if (input[section][key]) {
                            input[section][key] = input[section][key].replace(/-/g, '');
                        }
                    });
                }
            });

            const numKeys = ['a_purchase_amt', 'a_sale_amt', 'a_sale_profit'];
            if (input.biz_opp_detail) {
                numKeys.forEach((key) => {
                    if (/* typeof input.biz_opp_detail[key] === 'string' &&  */Number(input.biz_opp_detail[key]) > 999) {
                        console.log('999 넘는 key', key, input.biz_opp_detail[key])
                        input.biz_opp_detail[key] = /* Number( */
                            input.biz_opp_detail[key].replace(/,/g, '')
                       /*  ); */
                    }
                });
            }

            // 유효값 검사
            if (v_componentName === 'bizOpp') {
                if (msg === '등록') {
                    const validateStr = (obj, key) => obj?.[key] != null && obj[key].toString().trim() !== '';
                    const validateNum = (obj, key) => obj?.[key] != null && /* typeof obj[key] === 'number' &&  */Number(obj[key]) >= 0;

                    // const hasBizOpp = !!input?.biz_opp;
                    // const hasBizOppDetail = !!input?.biz_opp_detail;
                    // const hasBizOppActivity = !!input?.biz_opp_activity;

                    if (!input || input.length === 0) {
                        console.log('input이 없어요');
                        return;
                    } else {
                        // if (!hasBizOpp && !hasBizOppDetail && !hasBizOppActivity) {
                        //     console.log('table key 부분이 없어요');
                        // }

                        const validateFields = [
                            { key: 'a_biz_opp_name', validator: () => validateStr(input.biz_opp, 'a_biz_opp_name')},
                            { key: 'a_user_name', validator: () => validateStr(input, 'a_user_name')},
                            { key: 'a_sale_com2_code', validator: () => validateStr(input.biz_opp_detail, 'a_sale_com2_code')},
                            { key: 'a_progress2_rate_code', validator: () => validateStr(input.biz_opp, 'a_progress2_rate_code')},
                            { key: 'a_essential_achievement_tf', validator: () => input.biz_opp?.a_essential_achievement_tf !== null },
                            { key: 'a_contract_date', validator: () => validateStr(input.biz_opp, 'a_contract_date')},
                            { key: 'a_sale_date', validator: () => validateStr(input.biz_opp_detail, 'a_sale_date')},
                            { key: 'a_purchase_date', validator: () => validateStr(input.biz_opp_detail, 'a_purchase_date')},
                            { key: 'a_sale_amt', validator: () => validateNum(input.biz_opp_detail, 'a_sale_amt')},
                            { key: 'a_purchase_amt', validator: () => validateNum(input.biz_opp_detail, 'a_purchase_amt')},
                            { key: 'a_sale_profit', validator: () => validateNum(input.biz_opp_detail, 'a_sale_profit')},
                            { key: 'a_biz_section2_code', validator: () => validateStr(input.biz_opp_detail, 'a_biz_section2_code')},
                            { key: 'a_principal_product2_code', validator: () => validateStr(input.biz_opp_detail, 'a_principal_product2_code')},

                            { key: 'a_activity_details', validator: () => validateStr(input.biz_opp_activity, 'a_activity_details')},
                            { key: 'a_activity_date', validator: () => validateStr(input.biz_opp_activity, 'a_activity_date')},
                        ];
                        const nullField = validateFields.find(field => !field.validator());
                        if (nullField) {
                            const targetField = document.querySelector(`[name=${nullField.key}]`) || document.querySelector(`select[name=${nullField.key}]`);
                            console.log(targetField.placeholder);
                            console.log(targetField.nextSibling.innerText);
                            alert(`${targetField.nextSibling.innerText} 필드를 입력하세요.`);
                            if (targetField) {
                                targetField.focus(); // 🚀 React가 렌더링을 마친 후 포커스 이동
                            }
                            return;
                        } else {
                            confirmMsg = `사업 (기회) 명 ${input.biz_opp.a_biz_opp_name}을(를) 등록하시겠습니까?`;
                        }
                    }
                } else if (msg === '수정' && a_v_modalPropsData) {
                    console.log("a_v_modalPropsData: ", a_v_modalPropsData, "input:", input);

                    const validateStr = (obj, key) => obj?.[key] != null && obj[key].toString().trim() !== '';
                    const validateNum = (obj, key) => obj?.[key] != null && typeof obj[key] === 'number' && obj[key] >= 0;

                    // const hasBizOpp = !!input?.biz_opp;
                    // const hasBizOppDetail = !!input?.biz_opp_detail;
                    // const hasBizOppActivity = !!input?.biz_opp_activity;

                    if (!input || input.length === 0) {
                        console.log('input이 없어요');
                        return;
                    } else {
                        // if (!hasBizOpp && !hasBizOppDetail && !hasBizOppActivity) {
                        //     console.log('table key 부분이 없어요');
                        // }

                        const validateFields = [
                            { key: 'a_biz_opp_name', validator: () => validateStr(input.biz_opp, 'a_biz_opp_name')},
                            { key: 'a_essential_achievement_tf', validator: () => input.biz_opp?.a_essential_achievement_tf !== null },
                            { key: 'a_contract_date', validator: () => validateStr(input.biz_opp, 'a_contract_date')},
                            { key: 'a_progress2_rate_code', validator: () => validateStr(input.biz_opp, 'a_progress2_rate_code')},
                            { key: 'a_sale_date', validator: () => validateStr(input.biz_opp_detail, 'a_sale_date')},
                            { key: 'a_purchase_date', validator: () => validateStr(input.biz_opp_detail, 'a_purchase_date')},
                            { key: 'a_sale_amt', validator: () => validateNum(input.biz_opp_detail, 'a_sale_amt')},
                            { key: 'a_sale_profit', validator: () => validateNum(input.biz_opp_detail, 'a_sale_profit')},
                            { key: 'a_purchase_amt', validator: () => validateNum(input.biz_opp_detail, 'a_purchase_amt')},
                            { key: 'a_sale_com2_code', validator: () => validateStr(input.biz_opp_detail, 'a_sale_com2_code')},
                            { key: 'a_biz_section2_code', validator: () => validateStr(input.biz_opp_detail, 'a_biz_section2_code')},
                            { key: 'a_principal_product2_code', validator: () => validateStr(input.biz_opp_detail, 'a_principal_product2_code')},
                            { key: 'a_user_name', validator: () => validateStr(input.biz_opp_detail, 'a_user_name')},

                            { key: 'a_activity_details', validator: () => validateStr(input.biz_opp_activity, 'a_activity_details')},
                            { key: 'a_activity_date', validator: () => validateStr(input.biz_opp_activity, 'a_activity_date')},
                        ];
                        const nullField = validateFields.find(field => !field.validator());
                        if (nullField) {
                            alert(`${nullField.key}` );
                            return;
                        }

                    }




                    if (
                        (
                            validateStr(input.biz_opp, 'a_biz_opp_name') ||
                            input.biz_opp?.a_essential_achievement_tf !== null ||
                            validateStr(input.biz_opp, 'a_contract_date') ||
                            validateStr(input.biz_opp_detail, 'a_sale_date') ||
                            validateStr(input.biz_opp_detail, 'a_purchase_date') ||
                            validateNum(input.biz_opp_detail, 'a_sale_amt') ||
                            validateNum(input.biz_opp_detail, 'a_sale_profit') ||
                            validateNum(input.biz_opp_detail, 'a_purchase_amt') ||
                            validateStr(input.biz_opp_detail, 'a_sale_com2_code') ||
                            validateStr(input.biz_opp, 'a_progress2_rate_code') ||
                            validateStr(input.biz_opp_detail, 'a_biz_section2_code') ||
                            validateStr(input.biz_opp_detail, 'a_principal_product2_code') ||
                            validateStr(input.biz_opp_detail, 'a_user_name')
                        ) &&
                        (
                            validateStr(input.biz_opp_activity, 'a_activity_details') &&
                            validateStr(input.biz_opp_activity, 'a_activity_date')
                        )
                    ) {
                        confirmMsg = `사업 (기회) 일련 번호 ${a_v_modalPropsData.a_biz_opp_id}을(를) 수정하시겠습니까?`;
                    } else {
                        alert('필수값을 모두 기입하십시오.');
                        return; 
                    }
                }
            } else if (v_componentName === 'activity') {
                if (msg === '수정' && a_v_modalPropsData) {
                    console.log(input);
                    if (!input.biz_opp_activity?.a_activity_details) {
                        return;
                    }
                    const updateInput = { 
                        a_session_user_id: input.a_session_user_id, 
                        a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id, 
                        a_detail_no: a_v_modalPropsData.a_detail_no,
                        a_activity_date: a_v_modalPropsData.a_activity_date,
                        a_activity_details: input.biz_opp_activity.a_activity_details,
                        a_activity_no: a_v_modalPropsData.a_activity_no
                    };
                    console.log(a_v_modalPropsData, input, updateInput);
                    input = updateInput;
                    if (
                        (
                            (input.biz_opp_activity?.a_activity_details && input.biz_opp_activity.a_activity_details.trim() !== '') || 
                            (a_v_modalPropsData.a_activity_details && a_v_modalPropsData.a_activity_details.trim() !== '')
                        ) &&
                        (
                            (input.biz_opp_activity?.a_activity_date && input.biz_opp_activity.a_activity_date.trim() !== '') || 
                            (a_v_modalPropsData.a_activity_date && a_v_modalPropsData.a_activity_date.trim() !== '')
                        )
                    ) {
                        confirmMsg = `사업 (기회) 일련 번호 ${a_v_modalPropsData.a_biz_opp_id}의 영업 활동을 수정하시겠습니까?`;
                    } else {
                        alert('필수값을 모두 기입하십시오.');
                        return; 
                    }
                }
            }
        }
        if (confirmMsg) {
            confirmResult = window.confirm(confirmMsg);
        }
        if (
            (confirmResult && msg === '등록') || 
            (confirmResult && msg === '수정') || 
            (confirmResult && msg === '삭제') || 
            (msg === '조회') || (msg === '활동조회')) {
            try {
                if ((msg !== '조회') && (msg !== '활동조회')) { console.log("submit 될 input data\n", input); }
                const response = await apiMethods[method](endpoint, input);
                if (response?.status?.STATUS === 'NONE' || response[0]?.STATUS === 'FAIL') {
                    if (Array.isArray(response)){
                        console.log(response, response[0].STATUS, response[0].MESSAGE);
                        alert(response[0].MESSAGE);
                    } else {
                        if (msg === '활동조회') {
                            setActivityData('');
                        } else {
                            alert(response.status.MESSAGE);
                        }
                        console.log(response.status.STATUS, response.status.MESSAGE);
                    }
                    return;
                } else {
                    console.log(`${v_componentName} [${msg}부] response 송신 완료 `, "\nendpoint: ", endpoint, "\nresponse: ", response);
                    if (msg === '활동조회') {
                        setActivityData(response.data);
                        return response;
                    } else if (msg === '조회') {
                        setDetailData(response);
                        return response;
                    } else if (e && msg === '등록') { 
                        alert('정상적으로 등록되었습니다.'); 
                        onHide(true);
                        setIsRefresh(true);
                    } else if (e && msg === '수정') { 
                        alert('정상적으로 수정되었습니다.'); 
                        onHide(true);
                        setIsRefresh(true);
                    } else if (msg === '삭제') {
                        alert('정상적으로 삭제되었습니다.');
                        onHide(true);
                        setIsRefresh(true);
                        // return input;
                    } 
                }
                // 송신 끝
                
            } catch (error) {
                console.log('Error during login:', error, `f_handlingData(${method}) error!\n ${error.message}`);
                alert('오류가 발생했습니다. 관리자에게 문의하세요.', error);
            }
        } else {
            console.log('return')
            return;
        }
    }
    
    const userCheck = {
        a_session_user_id: auth.userId,
    }
    useEffect(() => {
        if (show) {
            setIsRefresh(false);
            setIsProDisabled(true);
            f_handlingData('post', 'select-popup-biz-opp/', userCheck, null, '조회');
            authCheck();
            if (v_modalPropsData) {
                f_handlingData('post', 'select-biz-opp-activity3/', userCheck, null, '활동조회');
            }
        } else {
            setInsertInput(p_bizopp);
            setUpdateInput([]);
            /* setUpdateInput([]);
            setInsertInput(p_bizopp); */
            // v_modalPropsData = {};
        }
    }, [show]); // show가 변경될 때만 실행되도록 보장
    useEffect(() => {
        if (detailData) {
            authCheck();
        }
    }, [detailData])
    // ================= POST 끝 ================= 

    // tree Modal로 연결
    
    const [showModal, setShowModal] = useState(false);
    const [v_childComponent, setVChildComponent] = useState(null);  
    const openModal = (e, v_treeName) => {
        if (v_treeName === 'product') {
            setVChildComponent('product');
            e.stopPropagation(); //이벤트 전파 방지
        } else if (v_treeName === '') {
            setVChildComponent('');
        } else { return; }
        setShowModal(true);
        console.log(setShowModal, showModal);
    }
    const closeModal = () => {
        setShowModal(false);
    };
/*     // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === '/login') {
                await dispatch(setLocation(location.pathname));
            }
        };

        syncPath();
    }, [currentPath, location.pathname, dispatch]); */
/* 
    useEffect(()=> {
        console.log("v_teamHandling: \n", v_teamHandling, 
        "\nv_deptHandling: \n", v_deptHandling,
        "\nv_userHandling: \n", v_userHandling)
    }, [v_teamHandling, v_deptHandling, v_userHandling]) */
    // UI 업데이트
    const [isProDisabled, setIsProDisabled] = useState(true);
    useEffect(() => {
        const updateUI = () => {
            /* if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            } */
            /* if(!a_v_modalPropsData && !detailData) {
                return;
            } */
            if (v_modalPropsData || detailData) {
                switch (v_componentName) {
                    case `bizOpp`:
                        setVHandlingHtml(
                            <Modal size='xl' show={show} onHide={onHide} scrollable centered>
                                <Modal.Header closeButton>
                                    <Modal.Title className='fs-3'>
                                        {
                                            (auth.userAuthCode === '0002') ? 
                                            ('사업 (기회) 상세 조회') : 
                                            ((a_v_modalPropsData ? '사업 (기회) 수정': '사업 (기회) 등록'))
                                        }
                                    </Modal.Title>
                                </Modal.Header> 
                                <Modal.Body>
                                    <div className='inputField modalcntnt'> 
                                        <div className='searchItem bizoppArea'>
                                            <>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={3} lg={4} xl={3} className='col d-flex align-items-center floating'  
                                                style={ 
                                                    (auth.userAuthCode === '0002') ? 
                                                    ({"pointerEvents": "none"}) : ({})
                                                }>
                                                    <FloatingLabel label='사업 (기회) 일련 번호'>
                                                        <Form.Control size='sm' type='text' className=''
                                                        name='a_biz_opp_id' 
                                                        /* data-key='biz_opp' */
                                                        placeholder='사업 (기회) 일련 번호'
                                                        onChange={f_handlingInput} 
                                                        // value={input.biz_opp_id}
                                                        defaultValue={a_v_modalPropsData?.a_biz_opp_id || ''} 
                                                        disabled={
                                                            (auth.userAuthCode === '0002') ? 
                                                            (false) : (true)
                                                        }/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={9} lg={8} xl={9} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='사업 (기회) 명'>
                                                        <Form.Control as='textarea' size='sm' type='text' className=''
                                                        name='a_biz_opp_name' 
                                                        data-key='biz_opp'
                                                        placeholder='사업 (기회) 명'
                                                        onChange={f_handlingInput} 
                                                        // value={input.biz_opp_name || ''}
                                                        defaultValue={a_v_modalPropsData?.a_biz_opp_name || ''} 
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'  
                                            style={ 
                                                (auth.userAuthCode === '0002') ? 
                                                ({"pointerEvents": "none"}) : ({})
                                            }>
                                                
                                                {/* <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='본부'>
                                                        <Form.Control size='sm' type='text' className='' placeholder='본부'
                                                        name='' 
                                                        // data-key='biz_opp_detail'
                                                        onChange={f_handlingInput}
                                                        // value={input.change_preparation_high_dept_name}
                                                        defaultValue={a_v_modalPropsData?.a_change_preparation_high_dept_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col> */}
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='소속 부서'>
                                                        <Form.Select size='sm' type='text' className='' placeholder='소속 부서'
                                                        name='a_change_preparation_dept_id' 
                                                        data-key='biz_opp_detail'
                                                        onChange={f_handlingInput} 
                                                        // value={input.change_preparation_dept_name || ''} 
                                                        defaultValue={
                                                            a_v_modalPropsData?.a_change_preparation_dept_name ? 
                                                            a_v_modalPropsData?.a_change_preparation_dept_name : (
                                                                a_v_modalPropsData?.change_preparation_high_dept_name ?
                                                                a_v_modalPropsData?.change_preparation_high_dept_name  : (
                                                                    v_teamHandling.teamMsg ? 
                                                                    v_teamHandling.teamMsg : v_teamHandling.deptMsg
                                                                )
                                                            )
                                                        }
                                                        disabled={v_deptHandling.deptDisabled}
                                                        >
                                                            <option 
                                                            value={(
                                                                a_v_modalPropsData ? 
                                                                a_v_modalPropsData.a_change_preparation_dept_id : 
                                                                v_teamHandling.teamValue ? 
                                                                v_teamHandling.teamValue : v_deptHandling.deptValue
                                                            )}>
                                                                {(
                                                                    a_v_modalPropsData ? 
                                                                    a_v_modalPropsData.a_change_preparation_dept_name : 
                                                                    v_teamHandling.teamValue ? 
                                                                    v_teamHandling.teamMsg : v_deptHandling.deptMsg
                                                                ) + ` (현재 값)`}
                                                            </option>
                                                            {(v_deptHandling.deptValue) ? 
                                                                <option value={v_deptHandling.deptValue}>{v_deptHandling.deptMsg}</option>
                                                                : '' 
                                                            }
                                                            {(v_depts) ? 
                                                                v_depts.map((e) => {
                                                                    if (e.dept_id) {
                                                                        return <option key={e.dept_id} value={e.dept_id || ''}>{e.dept_name}</option>
                                                                    } else if (e.change_preparation_dept_id) {
                                                                        return <option key={e.change_preparation_dept_id} value={e.change_preparation_dept_id || ''}>{e.change_preparation_dept_name}</option>
                                                                    }
                                                                })
                                                                :
                                                                ('')
                                                            }
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='담당자'>
                                                        <Form.Control size='sm' type='text' 
                                                        className='' placeholder='담당자'
                                                        name='a_user_name' 
                                                        // data-key='biz_opp_detail'
                                                        onChange={f_handlingInput} 
                                                        // value={input.user_name || ''} 
                                                        defaultValue={
                                                            a_v_modalPropsData ? 
                                                            a_v_modalPropsData?.a_user_name : 
                                                            (auth.userAuthCode === '0003' && auth.userResCode === '0002') ? '' :
                                                            (auth.userAuthCode === '0003' && auth.userResCode === '0003') ? '' :
                                                            v_userHandling.userMsg}
                                                        
                                                        disabled={v_userHandling.userDisabled}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='판품 번호 (진행률 90% 이상일 시 기입)'>
                                                        <Form.Control size='sm' type='text' className=''
                                                        name='a_sale_item_no' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='판품 번호 (진행률 90% 이상일 시 기입)'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_item_no || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_item_no || ''}
                                                        disabled={
                                                            (isProDisabled === true ? true : false /* 
                                                                (auth.userAuthCode === '0002') ? 
                                                                (false) : fal */)
                                                        }/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='최종 고객사 (선택)'>
                                                        <Form.Select size='sm' aria-label='selectBox' className='' name='a_last_client_com2_code'
                                                        data-key='biz_opp_detail'
                                                        placeholder='최종 고객사 (선택)' 
                                                        onChange={f_handlingInput} 
                                                        // value={input.progress2_rate_name || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_last_client_com2_code || ''}
                                                        >
                                                            <option 
                                                            value={(
                                                                a_v_modalPropsData ? 
                                                                a_v_modalPropsData.a_last_client_com2_code : '선택')}
                                                            >{(a_v_modalPropsData ? a_v_modalPropsData.a_last_client_com2_name : '선택') + ` (현재 값)`}</option>
                                                            {(detailData) ? 
                                                                (
                                                                    detailData?.data?.search_last_client_com_code.map((e) => {
                                                                        return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            }
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>  
                                            <Row className='d-flex justify-content-between'  
                                            style={ 
                                                (auth.userAuthCode === '0002') ? 
                                                ({"pointerEvents": "none"}) : ({})
                                            }>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출처'>
                                                        <Form.Select size='sm' aria-label='selectBox' className='' name='a_sale_com2_code'
                                                        data-key='biz_opp_detail'
                                                        placeholder='매출처' 
                                                        onChange={f_handlingInput} 
                                                        // value={input.progress2_rate_name || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_com2_code || ''}
                                                        >
                                                            <option 
                                                            value={(
                                                                a_v_modalPropsData ? 
                                                                a_v_modalPropsData.a_sale_com2_code : '선택')}
                                                            >{(a_v_modalPropsData ? a_v_modalPropsData.a_sale_com2_name : '선택') + ` (현재 값)`}</option>
                                                            {(detailData) ? 
                                                                (
                                                                    detailData?.data?.search_last_client_com_code.map((e) => {
                                                                        return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            }
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='진행률'>
                                                        <Form.Select size='sm' aria-label='selectBox' className='' name='a_progress2_rate_code' 
                                                        data-key='biz_opp'
                                                        onChange={f_handlingInput} 
                                                        // value={input.progress2_rate_name || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_progress2_rate_name || ''}
                                                        >
                                                            <option 
                                                            value={(
                                                                a_v_modalPropsData ? 
                                                                a_v_modalPropsData.a_progress2_rate_code : '선택')}
                                                            >{(a_v_modalPropsData ? a_v_modalPropsData.a_progress2_rate_name : '선택') + ` (현재 값)`}</option>
                                                            {(v_propsData ? 
                                                                (
                                                                    v_propsData?.data?.search_commonness_pro.map((e) => {
                                                                        return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            )}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <Form.Label htmlFor='inputChck2' className='essentialAchievementTf'>필달 여부</Form.Label>
                                                    <Form.Check type={`checkbox`} id={`inputChck2`} name='a_essential_achievement_tf' 
                                                    data-key='biz_opp'
                                                    onChange={f_handlingInput}
                                                    // checked={input.essential_achievement_tf || false} 
                                                    defaultChecked={a_v_modalPropsData?.a_essential_achievement_tf || false}
                                                    />
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='계약 일자'>
                                                        <Form.Control size='sm' type='date' className='' 
                                                        name='a_contract_date' 
                                                        data-key='biz_opp' 
                                                        placeholder='계약 일자'
                                                        onChange={f_handlingInput}
                                                        // value={input.contract_date || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_contract_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'
                                            style={ 
                                                (auth.userAuthCode === '0002') ? 
                                                ({"pointerEvents": "none"}) : ({})
                                            }>
                                                <Col xs={12} md={6} lg={6} xl={3}  className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 일자'>
                                                        <Form.Control size='sm' type='date' className='' 
                                                        name='a_sale_date' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='매출 일자'
                                                        onChange={f_handlingInput}
                                                        // value={input.sale_date || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매입 일자'>
                                                        <Form.Control size='sm' type='date' className='' placeholder='매입 일자'
                                                        name='a_purchase_date' 
                                                        data-key='biz_opp_detail' 
                                                        onChange={f_handlingInput}
                                                        // value={input.purchase_date || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_purchase_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='수금 일자 (선택)'>
                                                        <Form.Control size='sm' type='date' className='' 
                                                        name='a_collect_money_date' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='수금 일자 (선택)'
                                                        onChange={f_handlingInput}
                                                        // value={input.collect_money_date || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_collect_money_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 금액'>
                                                        <Form.Control size='sm' type='text' className='' 
                                                        name='a_sale_amt' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='매출 금액'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_amt || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_amt || 0}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-start'
                                            style={ 
                                                (auth.userAuthCode === '0002') ? 
                                                ({"pointerEvents": "none"}) : ({})
                                            }>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매입 금액'>
                                                        <Form.Control size='sm' type='text' className='' name='a_purchase_amt' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='매입 금액'
                                                        onChange={f_handlingInput}
                                                        // value={input.a_purchase_amt || ''}
                                                        defaultValue={a_v_modalPropsData?.a_purchase_amt || 0}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 이익'>
                                                        <Form.Control size='sm' type='text' className='' name='a_sale_profit' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='매출 이익'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_profit || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_profit || 0}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='사업 구분'>
                                                        <Form.Select size='sm' aria-label='사업 구분' className='' name='a_biz_section2_code' 
                                                        data-key='biz_opp_detail' 
                                                        onChange={f_handlingInput} 
                                                        defaultValue={a_v_modalPropsData?.a_biz_section2_name || ''}
                                                        >
                                                            <option value={(a_v_modalPropsData ? a_v_modalPropsData.a_biz_section2_name : '선택')}>{(a_v_modalPropsData ? a_v_modalPropsData.a_biz_section2_name : '선택') + ` (현재 값)`}</option>
                                                            {(detailData) ? 
                                                                (
                                                                    detailData?.data?.search_biz_section_code.map((e) => {
                                                                        return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            }
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='제품'>
                                                        <Form.Select size='sm' aria-label='selectBox' className='' name='a_principal_product2_code'
                                                        data-key='biz_opp_detail' 
                                                        onChange={f_handlingInput} 
                                                        defaultValue={a_v_modalPropsData?.a_principal_product2_name || ''}
                                                        >
                                                            <option value={(a_v_modalPropsData ? a_v_modalPropsData.a_principal_product2_name : '선택')}>{(a_v_modalPropsData ? a_v_modalPropsData.a_principal_product2_name : '선택') + ` (현재 값)`}</option>
                                                            {(detailData) ? 
                                                                (
                                                                    detailData?.data?.search_principal_product_code.map((e) => {
                                                                        return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            }
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>

                                                <Col xs={12} md={6} lg={6} xl={3} className='col d-flex align-items-center floating'>
                                                    <h4>매출 상세(팝업) 작업 중</h4>
                                                    <FloatingLabel label='매출 상세' className='inputTree' onClick={(e) => openModal(e, 'product')}>
                                                        <Form.Control readOnly size='sm' aria-label='selectBox' className='' name='a_principal_product2_code'
                                                        data-key='biz_opp_detail' 
                                                        onChange={f_handlingInput} 
                                                        defaultValue={a_v_modalPropsData?.a_principal_product2_name || ''}
                                                        />
                                                        <Search />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            </>
                                            <>
                                            {
                                                (auth.userAuthCode === '0002') ? 
                                                (<></>) : 
                                                (
                                                <Row className='d-flex justify-content-between activityArea'>
                                                    <Col xs={12} md={9} lg={8} xl={9} className='activity col d-flex align-items-center floating'>
                                                        <FloatingLabel label='활동 내역 신규 입력' >
                                                            <Form.Control as='textarea'size='sm' type='text' className='' 
                                                            name='a_activity_details' 
                                                            data-key='biz_opp_activity'
                                                            placeholder='활동 내역 신규 입력' 
                                                            onChange={f_handlingInput} 
                                                            // value={input.활동 내역 || ''} 
                                                            /* defaultValue={a_v_modalPropsData?.a_activity_details || ''} */
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xs={12} md={3} lg={4} xl={3} className='activity col d-flex align-items-center floating'>
                                                        <FloatingLabel label='활동 일자'>
                                                            <Form.Control size='sm' type='date' className='' 
                                                            name='a_activity_date' 
                                                            data-key='biz_opp_activity' 
                                                            placeholder='활동 일자'
                                                            onChange={f_handlingInput}
                                                            /* defaultValue={a_v_modalPropsData?.a_contract_date || ''} */
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>)
                                            }
                                                {a_v_modalPropsData ? 
                                                (<Row className='d-flex justify-content-between'>
                                                    <h3 style={{"textAlign": "left", "fontSize": "1.1rem", "paddingLeft":"0"}} className='mt-2'>활동 내역 이력 &#40;최근 5건&#41;</h3>
                                                    <ListGroup as='ol' numbered className='col activity'>
                                                        {activityData ? 
                                                            activityData.map((e) => {
                                                                return (
                                                                    <>
                                                                    <ListGroup.Item as='li' className=''>
                                                                        <div className='activityDetails'>{e.activity_details}</div>
                                                                        <div className='fw-bold activityDate'>{e.activity_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}</div>
                                                                    </ListGroup.Item>
                                                                    </>
                                                                )
                                                            })
                                                        :  (<></>)
                                                        }
                                                    </ListGroup>
                                                </Row>)
                                                : ('')
                                                }
                                            </>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className='btnArea justify-content-center'>
                                    {
                                        (auth.userAuthCode === '0002') ? 
                                        (<></>) : 
                                        (a_v_modalPropsData ? 
                                            (<>
                                            <Button variant='primary' onClick={(e) => f_handlingData('post', 'renewal-biz-opp/', updateInput, e, '수정')}>저장</Button>

                                            {auth.userAuthCode === '0001' ? 
                                                <Button variant='danger' onClick={(e) => f_handlingData('post', 'delete-biz-opp/', updateInput, e, '삭제')}>삭제</Button>
                                                : 
                                                (<></>)
                                            }
                                            </>) 
                                            : 
                                            (<>
                                            <Button variant='primary' onClick={(e) => f_handlingData('post', 'insert-biz-opp/', insertInput, e, '등록')}>저장</Button> 
                                            </>)
                                        )
                                    }
                                    <Button variant='secondary' onClick={onHide}>닫기</Button>
                                </Modal.Footer>
                            </Modal>
                        );
                        break;
                    
                    case `activity`: 
                        setVHandlingHtml(
                        <Modal size='xl' show={show} onHide={onHide} scrollable centered>
                            <Modal.Header closeButton>
                            <Modal.Title className='fs-3'>
                                {
                                (auth.userAuthCode !== '0001') ? 
                                '영업 활동 상세 조회' : '영업 활동 갱신'
                                }
                            </Modal.Title>
                            </Modal.Header> 
                            <Modal.Body>
                            {
                                (v_modalPropsData && auth.userAuthCode === '0002') ? 
                                (<></>) : 
                                (
                                    <>
                                    <Row className='d-flex justify-content-between mb-2'>
                                        <Col xs={12} md={3} lg={3} className=''>
                                            <FloatingLabel label='사업 일련 번호'>
                                                <Form.Control size='sm' type='text' className='' 
                                                name='a_biz_opp_id' 
                                                data-key='biz_opp' 
                                                placeholder='사업 일련 번호'
                                                onChange={f_handlingInput}
                                                defaultValue={a_v_modalPropsData?.a_biz_opp_id || ''} 
                                                style={auth.userAuthCode === '0001' ? { 'pointerEvents':'auto' } : {'pointerEvents':'none'}}
                                                disabled={auth.userAuthCode === '0001' ? true : false}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={6} lg={6} className=''>
                                            <FloatingLabel label='사업 (기회) 명'>
                                                <Form.Control as='textarea' size='sm' type='text' className=''
                                                name='a_biz_opp_name' 
                                                data-key='biz_opp'
                                                placeholder='사업 (기회) 명'
                                                onChange={f_handlingInput} 
                                                // value={input.biz_opp_name || ''}
                                                defaultValue={a_v_modalPropsData?.a_biz_opp_name || ''}
                                                style={auth.userAuthCode === '0001' ? { 'pointerEvents':'auto' } : {'pointerEvents':'none'}}
                                                disabled={auth.userAuthCode === '0001' ? true : false}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3} lg={3} className=''>
                                            <FloatingLabel label='활동 일자' style={auth.userAuthCode === '0001' ? { 'pointerEvents':'auto' } : {'pointerEvents':'none'}}>
                                                <Form.Control size='sm' type='date' className='' 
                                                name='a_activity_date' 
                                                data-key='biz_opp_activity' 
                                                placeholder='활동 일자'
                                                onChange={f_handlingInput}
                                                defaultValue={a_v_modalPropsData?.a_activity_date || ''}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <Row className='d-flex justify-content-between'>
                                        <Col xs={12} md={12} lg={12} className=''>
                                            <FloatingLabel label='활동 내역' >
                                                <Form.Control as='textarea' size='sm' type='text' className='activityDetails' 
                                                name='a_activity_details' 
                                                data-key='biz_opp_activity'
                                                placeholder='활동 내역' 
                                                onChange={f_handlingInput} 
                                                style={auth.userAuthCode === '0001' ? { 'pointerEvents':'auto' } : {'pointerEvents':'none'}}
                                                defaultValue={a_v_modalPropsData?.a_activity_details || ''}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    </>
                                )
                            }
                            </Modal.Body>
                                <Modal.Footer className='btnArea justify-content-center'>
                                        {
                                            (auth.userAuthCode !== '0001') ? 
                                            (<></>) : 
                                            (a_v_modalPropsData ? 
                                                
                                                <>
                                                <Button variant='primary' onClick={(e) => f_handlingData('post', 'update-biz-opp-activity/', updateInput, e, '수정')}>저장</Button>
                                                
                                                    {auth.userAuthCode === '0001' ? 
                                                    <Button variant='danger' onClick={(e) => f_handlingData('post', 'delete-biz-opp-activity/', updateInput, e, '삭제')}>삭제</Button>
                                                    : 
                                                    (<></>)}
                                                </>
                                                : 
                                                (<></>)
                                            )
                                        }
                                    <Button variant='secondary' onClick={onHide}>닫기</Button>
                                </Modal.Footer>
                        </Modal>
                        );
                        break;
                    default:
                        setVHandlingHtml(<h1>안녕하세요 InputFieldDetail.js 작업 중입니다.</h1>);
                        break;
                }

            }
                
            // }
        };
        updateUI();
    }, [/* currentPath */, show, onHide, insertInput, activityData, detailData, v_depts /* updateInput */, v_modalPropsData, v_propsData, /* deptData */, v_deptHandling, v_teamHandling, v_userHandling, isProDisabled]);

    return (
        <div id='inputFieldDetail'>
            {v_handlingHtml}
            <Trees v_treeName={v_childComponent} show={showModal} onHide={closeModal} data={detailData}/>
        </div>
    );
};

export default InputFieldDetail;
