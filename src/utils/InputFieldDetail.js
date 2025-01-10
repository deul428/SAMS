import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from './api';

import roots from './datas/Roots';
import '../styles/_customModal.scss';
import '../styles/_search.scss';
import { Modal, Button, Form, Row, Col, ListGroup, FloatingLabel } from 'react-bootstrap';

const InputFieldDetail = ({ show, onHide, v_componentName, v_propsData, v_modalPropsData, authLevels }) => {
    // v_propsData: inputField에서 받아오는 list 포함 데이터 / v_modalPropsData: dynamicTable에서 받아오는 테이블 데이터, 사용자가 선택한 행의 데이터만 불러옴
    // console.log(authLevels);
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [endpoint, setEndpoint] = useState(null);
    
    // 삭제 누를 시 confirm 
    const f_warningMsg = () => {
        if (window.confirm('정말 삭제하시겠습니까?')){
            alert('정상적으로 삭제되었습니다.');
            onHide(true);
        }
    }
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

    const p_bizopp_insert = {
        a_session_user_id: auth.userId,
        a_biz_opp_id: '',
        a_biz_opp_name: '',
        a_progress2_rate_code: '',
        a_contract_date: '',
        a_essential_achievement_tf: false,

        a_change_preparation_dept_id: '',
        a_last_client_com2_code: '',
        a_last_client_com2_name: '',
        a_sale_com2_code: '',
        a_sale_com2_name: '',
        a_sale_item_no: '',
        a_sale_date: '',
        a_sale_amt: 0,
        a_sale_profit: 0,
        a_purchase_date: '',
        a_purchase_amt: 0,
        a_collect_money_date: '',
        a_biz_section2_code: '',
        a_biz_section2_name: '',
        a_principal_product2_code: '',
        a_principal_product2_name: '',

        a_activity_details: '',
        a_activity_date: '',
    }



    const p_bizopp_update = {
        a_session_user_id: auth.userId,
        biz_opp: { 
            // a_biz_opp_id: '',
            
            a_biz_opp_name: '',
            a_progress2_rate_code: '',
            a_contract_date: '',
            a_essential_achievement_tf: false,
        },
        biz_opp_detail: {
            a_change_preparation_dept_id: '9801',
            a_last_client_com2_code: '',
            a_sale_com2_code: '',
            a_sale_item_no: '',
            a_sale_date: '',
            a_sale_amt: 0,
            a_sale_profit: 0,
            a_purchase_date: '',
            a_purchase_amt: 0,
            a_collect_money_date: '',
            a_biz_section2_code: '',
            a_principal_product2_code: '',

            a_user_name: '',

        },
        biz_opp_activity: {
            a_activity_details: '',
            a_activity_date: '',
        }
    }
    const [insertInput, setInsertInput] = useState(p_bizopp_update);
    // 변화 감지 추출
    const [updateInput, setUpdateInput] = useState([]);

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
        console.log(e.target.name, e.target.value);

        const updateValue = (setState) => {
            setState((prevInput) => {
                const updatedInput = { ...prevInput, a_session_user_id: auth.userId, };
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
    
    useEffect(()=>{
        // console.log("input: ", insertInput, "\n\nchangeInput: ", updateInput);
    }, [insertInput, updateInput])
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
    }
    // 2. UI 표현용
    useEffect(() => {
        // a_v_modalPropsData 데이터 핸들링 후 input 객체에 복사
        // console.log("-------------- 수정 시 --------------");
        // console.log("v_modalPropsData: ", v_modalPropsData);
        if (v_modalPropsData) {
            // ..................... 날짜 위젯과 매핑 YYYYMMDD -> YYYY-MM-DD .....................
            const dateKeys = ['a_sale_date', 'a_collect_money_date', 'a_purchase_date', 'a_contract_date'];
            dateKeys.forEach(key => {
                if (a_v_modalPropsData[key]) {
                    return a_v_modalPropsData[key] = a_v_modalPropsData[key].replace(/(\d{3})(\d{2})(\d{2})/, '$1-$2-$3');
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
                const updatedInput = { ...prevInput, a_session_user_id: auth.userId, };
                updatedInput.biz_opp = {
                    ...prevInput.biz_opp,
                    a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id,
                }
                return updatedInput;
            });
            setUpdateInput((prevInput) => {
                const updatedInput = { ...prevInput, a_session_user_id: auth.userId, };
                updatedInput.biz_opp = {
                    ...prevInput.biz_opp,
                    a_biz_opp_id: a_v_modalPropsData.a_biz_opp_id,
                }
                return updatedInput; 
            });
        }
    }, [v_modalPropsData]);
    // ----------------- 2) 수정 시 핸들링 끝 -----------------
    // ================= 사업 기회 조회 테이블부 핸들링 끝 ================= 

    // ================= POST ================= 
    const [getData, setGetData] = useState(null);
    const f_handlingData = async (method, endpoint, input = null, e, msg) => {
        let confirmMsg;
        console.log("-----------------input--------------", input);
        if (input && e) {
            e.preventDefault(); // submit 방지
            // 유효값 검사
            // 날짜 yyyy-mm-dd -> yyyymmdd
           /*  const dateKeys = ['a_sale_date', 'a_collect_money_date', 'a_purchase_date', 'a_contract_date', 'a_activity_date'];
            dateKeys.forEach(key => {
                if (input[key]) {
                    return input[key] = input[key].replace(/-/g, '');
                }
            });
            // 숫자 , 제거 
            const numKeys = ['a_purchase_amt', 'a_sale_amt', 'a_sale_profit'];
            numKeys.forEach(key => {
                if (input[key]) {
                    return input[key] = input[key].replace(/,/g, '');
                }
            }); */
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
                    if (input.biz_opp_detail[key] && input.biz_opp_detail[key] instanceof String) {
                        input.biz_opp_detail[key] = Number(
                            input.biz_opp_detail[key].replace(/,/g, '')
                        );
                    }
                });
            }
            
            

/*             // 유효값 검사 끝
            if (!msg && input.a_biz_opp_name) {
                confirmMsg = `${input.a_biz_opp_name}을(를) 등록하시겠습니까?`;
            } else {
                alert('필수값을 모두 기입하십시오.');
                return; 
            } */
        }
        // if (window.confirm(confirmMsg) || msg) {
            try {
                // 송신
                /* if (endpoint === 'select-popup-biz-opp/' && msg === 'authCheck') {
                    console.log(endpoint, input, e, msg);
                } */
                if(e) {console.log("submit 될 input data\n", input, "\ne:", e);}
                const response = await apiMethods[method](endpoint, input);
                if (response?.status?.STATUS === 'NONE' || response[0]?.STATUS === 'FAIL') {
                    if(Array.isArray(response)){
                        console.log(response[0].STATUS, response[0].MESSAGE);
                    } else {
                        console.log(response.status.STATUS, response.status.MESSAGE);
                    }
                    return;
                } else {
                    console.log('사업 (기회) 등록/수정 response 송신 완료', "\nendpoint: ", endpoint, "\nresponse: ", response);
                    if (e && !msg) { alert('정상적으로 등록되었습니다.'); }
                    // onHide(true);
                    setGetData(response);
                    return response;
                }
                // 송신 끝
                
            } catch (error) {
                console.log('Error during login:', error, `f_handlingData(${method}) error! ${error.message}`);
                alert('오류가 발생했습니다. 관리자에게 문의하세요.', error);
            }
        /* } else {
            return;
        } */
    }
    const userCheck = {
        a_session_user_id: auth.userId,
    }
    useEffect(() => {
        if (show) {
            // console.log(show, onHide);
            // console.log(userCheck);
            f_handlingData('post', 'select-popup-biz-opp/', userCheck, null, 'authCheck');
        }
    }, [show]); // show가 변경될 때만 실행되도록 보장
    
    // ================= POST 끝 ================= 

/*     // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === '/login') {
                await dispatch(setLocation(location.pathname));
            }
        };

        syncPath();
    }, [currentPath, location.pathname, dispatch]); */
    // UI 업데이트
    useEffect(() => {
        const updateUI = () => {
            /* if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            } */
            if(!a_v_modalPropsData && !getData) {
                return;
            }
            if (v_modalPropsData || getData) {
                switch (v_componentName) {
                    case `bizOpp`:
                        setVHandlingHtml(
                            <Modal size='xl' show={show} onHide={onHide} scrollable>
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
                                        <div className='searchItem bizoppArea' 
                                        style={ 
                                            (auth.userAuthCode === '0002') ? 
                                            ({"pointerEvents": "none"}) : ({})
                                        }
                                        >
                                            <>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={3} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='사업 일련 번호'>
                                                        <Form.Control size='sm' type='text' className=''
                                                        name='a_biz_opp_id' 
                                                        /* data-key='biz_opp' */
                                                        placeholder='사업 일련 번호'
                                                        onChange={f_handlingInput} 
                                                        // value={input.biz_opp_id}
                                                        defaultValue={a_v_modalPropsData?.a_biz_opp_id || ''} 
                                                        disabled={
                                                            (auth.userAuthCode === '0002') ? 
                                                            (false) : (true)
                                                        }/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={9} lg={9} className='col d-flex align-items-center floating'>
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
                                            <Row className='d-flex justify-content-between'>
                                                
                                                {/* <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='본부'>
                                                        <Form.Control size='sm' type='text' className='' placeholder='본부'
                                                        name='' 
                                                        // data-key='biz_opp_detail'
                                                        onChange={f_handlingInput}
                                                        // value={input.high_dept_name}
                                                        defaultValue={a_v_modalPropsData?.a_high_dept_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col> */}
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='소속 부서'>
                                                        <Form.Select size='sm' type='text' className='' placeholder='소속 부서'
                                                        name='a_change_preparation_dept_id' 
                                                        data-key='biz_opp_detail'
                                                        onChange={f_handlingInput}
                                                        // value={input.dept_name || ''} 
                                                        defaultValue= {(a_v_modalPropsData?.a_dept_name) 
                                                            ?
                                                            (a_v_modalPropsData?.a_dept_name || '')
                                                            : (a_v_modalPropsData?.a_headquarters_name || '')
                                                        }
                                                        // defaultValue={'9801'}
                                                        >
                                                            <option 
                                                            value={(
                                                                a_v_modalPropsData ? 
                                                                a_v_modalPropsData.a_change_preparation_dept_id : '선택')}
                                                            >{(a_v_modalPropsData ? a_v_modalPropsData.a_change_preparation_dept_name : '선택')}</option>
                                                            {(getData) ? 
                                                                (
                                                                    getData?.data?.search_dept_id.map((e) => {
                                                                        return <option key={e.dept_id} value={e.dept_id || ''}>{e.dept_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            }
                                                            {/* <option 
                                                                value={(
                                                                    a_v_modalPropsData ? 
                                                                    a_v_modalPropsData.a_change_preparation_dept_id : '선택')}
                                                                >{(a_v_modalPropsData ? a_v_modalPropsData.a_change_preparation_dept_name : '선택')}</option>
                                                                {(v_propsData &&  v_propsData?.data?.search_dept_id? 
                                                                    (
                                                                        v_propsData?.data?.search_dept_id.map((e) => {
                                                                            return <option key={e.dept_id} value={e.dept_id || ''}>{e.dept_name}</option>
                                                                        })
                                                                    )
                                                                    :
                                                                    ('')
                                                                )} */}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='영업 담당자'>
                                                        <Form.Control size='sm' type='text' 
                                                        className='' placeholder='영업 담당자'
                                                        name='a_user_name' 
                                                        data-key='biz_opp_detail'
                                                        onChange={f_handlingInput} 
                                                        // value={input.user_name || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_user_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='판품 번호'>
                                                        <Form.Control size='sm' type='text' className=''
                                                        name='a_sale_item_no' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='판품 번호'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_item_no || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_item_no || ''}
                                                        disabled={
                                                            (auth.userAuthCode === '0002') ? 
                                                            (false) : (true)
                                                        }/>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
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
                                                            >{(a_v_modalPropsData ? a_v_modalPropsData.a_last_client_com2_name : '선택')}</option>
                                                            {(getData) ? 
                                                                (
                                                                    getData?.data?.search_last_client_com_code.map((e) => {
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
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
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
                                                            >{(a_v_modalPropsData ? a_v_modalPropsData.a_sale_com2_name : '선택')}</option>
                                                            {(getData) ? 
                                                                (
                                                                    getData?.data?.search_last_client_com_code.map((e) => {
                                                                        return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            }
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
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
                                                            >{(a_v_modalPropsData ? a_v_modalPropsData.a_progress2_rate_name : '선택')}</option>
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
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <Form.Label htmlFor='inputChck2'>필달 여부</Form.Label>
                                                    <Form.Check type={`checkbox`} id={`inputChck2`} name='a_essential_achievement_tf' 
                                                    data-key='biz_opp'
                                                    onChange={f_handlingInput}
                                                    // checked={input.essential_achievement_tf || false} 
                                                    defaultChecked={a_v_modalPropsData?.a_essential_achievement_tf || false}
                                                    />
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
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
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
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
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
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
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
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
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 금액'>
                                                        <Form.Control size='sm' type='text' className='' 
                                                        name='a_sale_amt' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='매출 금액'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_amt || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_amt || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매입 금액'>
                                                        <Form.Control size='sm' type='text' className='' name='a_purchase_amt' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='매입 금액'
                                                        onChange={f_handlingInput}
                                                        // value={input.a_purchase_amt || ''}
                                                        defaultValue={a_v_modalPropsData?.a_purchase_amt || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 이익'>
                                                        <Form.Control size='sm' type='text' className='' name='a_sale_profit' 
                                                        data-key='biz_opp_detail' 
                                                        placeholder='매출 이익'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_profit || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_sale_profit || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='사업 구분'>
                                                        <Form.Select size='sm' aria-label='사업 구분' className='' name='a_biz_section2_code' 
                                                        data-key='biz_opp_detail' 
                                                        onChange={f_handlingInput} 
                                                        // value={input.biz_section2_name || ''}
                                                        defaultValue={a_v_modalPropsData?.a_biz_section2_name || ''}
                                                        >
                                                            <option value={(a_v_modalPropsData ? a_v_modalPropsData.a_biz_section2_name : '선택')}>{(a_v_modalPropsData ? a_v_modalPropsData.a_biz_section2_name : '선택')}</option>
                                                            {(getData) ? 
                                                                (
                                                                    getData?.data?.search_biz_section_code.map((e) => {
                                                                        return <option key={e.small_classi_code} value={e.small_classi_code || ''}>{e.small_classi_name}</option>
                                                                    })
                                                                )
                                                                :
                                                                ('')
                                                            }
                                                            {/* <option value='1'>One</option>
                                                            <option value='2'>Two</option>
                                                            <option value='3'>Three</option> */}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={3} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='제품'>
                                                        <Form.Select size='sm' aria-label='selectBox' className='' name='a_principal_product2_code'
                                                        data-key='biz_opp_detail' 
                                                        onChange={f_handlingInput} 
                                                        // value={input.product2_name || ''} 
                                                        defaultValue={a_v_modalPropsData?.a_product2_name || ''}
                                                        >
                                                            <option value={(a_v_modalPropsData ? a_v_modalPropsData.a_product2_name : '선택')}>{(a_v_modalPropsData ? a_v_modalPropsData.a_product2_name : '선택')}</option>
                                                            {(getData) ? 
                                                                (
                                                                    getData?.data?.search_principal_product_code.map((e) => {
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
                                            </>
                                            <>
                                            {
                                                (auth.userAuthCode === '0002') ? 
                                                (<></>) : 
                                                (
                                                <Row className='d-flex justify-content-between activityArea'>
                                                    <Col xs={12} md={9} lg={9} className='activity col d-flex align-items-center floating'>
                                                        <FloatingLabel label='활동 내역 신규 입력' >
                                                            <Form.Control as='textarea'size='sm' type='text' className='' 
                                                            name='a_activity_details' 
                                                            data-key='biz_opp_activity'
                                                            placeholder='활동 내역 신규 입력' 
                                                            onChange={f_handlingInput} 
                                                            // value={input.활동 내역 || ''} 
                                                            defaultValue={a_v_modalPropsData?.a_activity_details || ''}
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xs={12} md={6} lg={3} className='activity col d-flex align-items-center floating'>
                                                        <FloatingLabel label='활동 일자'>
                                                            <Form.Control size='sm' type='date' className='' 
                                                            name='a_activity_date' 
                                                            data-key='biz_opp_activity' 
                                                            placeholder='활동 일자'
                                                            onChange={f_handlingInput}
                                                            defaultValue={a_v_modalPropsData?.a_contract_date || ''}
                                                            />
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>)
                                            }
                                            <Row className='d-flex justify-content-between'>
                                                <h3 style={{"textAlign": "left", "fontSize": "1.1rem", "paddingLeft":"0"}} className='mt-2'>활동 내역 이력 &#40;최근 5건&#41;</h3>
                                                <ListGroup as='ol' numbered className='col activity '>
                                                    <ListGroup.Item as='li' className='d-flex justify-content-between align-items-start'>
                                                        <div className='ms-2 me-auto'>
                                                        <div className='fw-bold'>Subheading</div>
                                                        Cras justo odio
                                                        </div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item as='li' className='d-flex justify-content-between align-items-start'>
                                                        <div className='ms-2 me-auto'>
                                                        <div className='fw-bold'>Subheading</div>
                                                        Cras justo odio
                                                        </div>
                                                    </ListGroup.Item>
                                                    <ListGroup.Item as='li' className='d-flex justify-content-between align-items-start'>
                                                        <div className='ms-2 me-auto'>
                                                        <div className='fw-bold'>Subheading</div>
                                                        Cras justo odio
                                                        </div>
                                                    </ListGroup.Item>
                                                </ListGroup>
                                            </Row>
                                            </>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className='btnArea justify-content-center'>
                                        {
                                            (auth.userAuthCode === '0002') ? 
                                            (<></>) : 
                                            ((a_v_modalPropsData ? (<Button variant='warning'>사업 (기회) 복제</Button>): (<></>)))
                                        }
                                            
                                    {(
                                        v_modalPropsData ? 
                                        (<Button variant='primary' onClick={(e) => f_handlingData('post', 'insert-biz-opp/', updateInput, e)}>수정</Button>)
                                        : 
                                        (<Button variant='primary' onClick={(e) => f_handlingData('post', 'insert-biz-opp/', insertInput, e)}>등록</Button>)
                                    )}

                                    <Button variant='danger' onClick={f_warningMsg}>삭제</Button>
                                    <Button variant='secondary' onClick={onHide}>닫기</Button>
                                </Modal.Footer>
                            </Modal>
                        );
                        break;
                    default:
                        setVHandlingHtml(<h1>안녕하세요 InputFieldDetail.js 작업 중입니다.</h1>);
                }

            }
                
            // }
        };
        updateUI();
    }, [/* currentPath */, show, onHide, insertInput, getData /* updateInput */, v_modalPropsData, v_propsData /* mode */]);

    return (
        <div id='inputFieldDetail'>
            {v_handlingHtml}
        </div>
    );
};

export default InputFieldDetail;
