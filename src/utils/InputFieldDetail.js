import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from './api';

import roots from './datas/Roots';
import '../styles/_customModal.scss';
import '../styles/_search.scss';
import { Modal, Button, Form, Row, Col, ListGroup, FloatingLabel } from 'react-bootstrap';

const InputFieldDetail = ({ show, onHide, v_componentName, v_propsData, v_modalPropsData, mode }) => {
    console.log("---------------------------------------------------------v_modalPropsData", v_modalPropsData);
    
    let updated_v_modalPropsData;
    if(v_modalPropsData) {
        updated_v_modalPropsData = Object.fromEntries(
            Object.entries(v_modalPropsData).map(([key, value]) => [`a_${key}`, value])
        );
        console.log(updated_v_modalPropsData);
    }
    
    // console.log(v_componentName, 'Modal Props - show:', show, "mode:", mode,/*  ', onHide:', onHide */);
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

    // ----------------- 1) 등록 및 수정 input 핸들링 -----------------
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
        a_biz_opp_name: '',
        a_progress2_rate_code: '',
        a_contract_date: '',
        a_essential_achievement_tf: false,

        a_session_user_id: auth.userId,
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
    const [input, setInput] = useState(p_bizopp);
    // 변화 감지 추출
    const [changeInput, setChangeInput] = useState([]);

    // input field 값 input에 저장
    /*  12.26. 기준
        input: UI 업데이트를 위함. 날짜 및 금액 정규식 들어감.
        changeInput: 실제로 백엔드에 전송될 데이터. 
    */
    // let isComposing = false;
    const [isComposing, setIsComposing] = useState(false);
    const f_handlingInput = (e) => {
        const { name, value, type, checked } = e.target;
        // 조합 중에는 값만 유지
        /* if (isComposing) {
            return;
        } */
        // console.log(e.target.value);
        setInput((prevInput) => ({
            ...prevInput,
            [name]: type === 'checkbox' ? checked : value, //e.target.name의 값을 키로, e.target.value를 값으로 사용
        }));

        const id = input.a_biz_opp_id;
        // 변화 감지 추출
        setChangeInput((changeInput) => ({
            ...changeInput,
            a_biz_opp_id: id,
            a_session_user_id: auth.userId,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
        
    };
    /* const handleCompositionStart = () => {
        // setIsComposing(true); // 조합 시작
        console.log("Composition started");
    };

    const handleCompositionEnd = (e) => {
        // setIsComposing(false); // 조합 끝
        console.log("Composition ended with value:", e.target.value);
        const { name, value } = e.target;
        // 조합 완료 후 최종 상태 업데이트
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    }; */
    
/*     // 변화 감지 추출 디버깅용
    useEffect(() => {
        // console.log('changeInput: ', changeInput);
        // console.log('input: ', input);
        
        // console.log("v_modalPropsData 들어와서 복사한 이후 input:\n", input);
        // console.log("v_modalPropsData 들어와서 복사한 이후 input.biz_opp_name:\n", input.biz_opp_name);
    }, [changeInput, input]); */
    

    // 앞으로 필요한 것: 수정 누를 시 변화 키만 전송. 이때, 등록을 누를 시에도 input이 아닌 변화 키(changeInput)를 전송해도 되는지 체크해 보기. 또한 등록 후 수정 시 변화 키를 불러와도 괜찮은지 테스트. 


    // ..................... post용 객체, input field value 저장해서 이후 서버로 송신 끝 .....................
    // ----------------- 1) 등록 및 수정 input 핸들링 끝 -----------------

    // ----------------- 2) 수정 시 핸들링 -----------------
    useEffect(() => {
        // v_modalPropsData 데이터 핸들링 후 input 객체에 복사
        // console.log('v_modalPropsData: ', v_modalPropsData);
        if (updated_v_modalPropsData) {
            // console.log("v_modalPropsData 사업 기회명:", v_modalPropsData.biz_opp_name);
            // console.log("v_modalPropsData 들어온 이후 복사하기 이전 input.biz_opp_name:\n", input.biz_opp_name);
            // ..................... 날짜 위젯과 매핑 YYYYMMDD -> YYYY-MM-DD .....................
            const dateKeys = ['sale_date', 'collect_money_date', 'purchase_date', 'contract_date'];
            dateKeys.forEach(key => {
                if (updated_v_modalPropsData[key]) {
                    return updated_v_modalPropsData[key] = updated_v_modalPropsData[key].replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                }
            });
            // ..................... 날짜 위젯과 매핑 YYYYMMDD -> YYYY-MM-DD 끝 .....................
            // ..................... 숫자 문자열로 변환 후 쉼표 추가 ..................... 
            const numKeys = ['purchase_amt', 'sale_amt', 'sale_profit'];
            numKeys.forEach(key => {
                if (updated_v_modalPropsData[key]) {
                    return updated_v_modalPropsData[key] = updated_v_modalPropsData[key].toLocaleString('ko-KR');
                }
            });
            // ..................... 숫자 문자열로 변환 후 쉼표 추가 끝 ..................... 
            
            setInput((prevInput) => ({
                ...prevInput,
                ...updated_v_modalPropsData,
            }));

            const id = updated_v_modalPropsData.a_biz_opp_id;

            // 컴포넌트 호출 시 modal data의 사업 기회 id 복사
            setChangeInput(() => ({
                a_session_user_id: auth.userId,
                a_biz_opp_id: id,
            }));
        }
        // console.log('v_modal data 복사 후 input: ', input);
    }, [v_modalPropsData]);
    // ----------------- 2) 수정 시 핸들링 끝 -----------------
    // ================= 사업 기회 조회 테이블부 핸들링 끝 ================= 

    // ================= POST ================= 
    const f_submitData = async (method, endpoint, input = null, e) => {
        if(e) {
            e.preventDefault(); // submit 방지
        }
        let confirmMsg;
        // console.log('제출될 input(changeInput): ', input);
        /* if (input.a_biz_opp_id) {
            confirmMsg = `${input.a_biz_opp_id}을(를) 등록하시겠습니까?`;
        } else {
            alert('사업 일련 번호를 기재하십시오.');
            return; 
        } */
        if (window.confirm(confirmMsg)) {
            try {

                // 유효값 검사

                /* // 날짜 yyyy-mm-dd -> yyyymmdd
                const dateKeys = ['sale_date', 'collect_money_date', 'purchase_date', 'contract_date'];
                dateKeys.forEach(key => {
                    if (input[key]) {
                        return input[key] = input[key].replace(/-/g, '');
                    }
                });

                // 숫자 , 제거 
                const numKeys = ['purchase_amt', 'sale_amt', 'sale_profit'];
                numKeys.forEach(key => {
                    if (input[key]) {
                        return input[key] = input[key].replace(/,/g, '');
                    }
                }); */

                alert('정상적으로 등록되었습니다.');
                onHide(true);
                
                const response = await apiMethods[method]('select-biz-opp2/', input);
                console.log('사업 (기회) 등록/수정 response 송신 완료', "\nendpoint: ", endpoint, "\nresponse: ", response);
                return response;
                console.log('제출된 input: ', input);
            } catch (error) {
                console.log('Error during login:', error, `f_handlingData(${method}) error! ${error.message}`);
                alert('오류가 발생했습니다. 관리자에게 문의하세요.', error);
            }

        } else {
            return;
        }
    }
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

            if(!updated_v_modalPropsData && mode === '수정') {
                console.log('아직인데');
                return;
            } /* else if(!v_modalPropsData && mode === '등록') {
                console.log("mode 있어요", mode);

            } else {
                console.log("else mode 있어요", v_modalPropsData, mode);
            }
             */
            
            // if(v_modalPropsData) {
                switch (v_componentName) {
                    case `bizOpp`:
                        setVHandlingHtml(
                            <Modal size='xl' show={show} onHide={onHide} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title className='fs-3'>{
                                        (updated_v_modalPropsData ? '사업 (기회) 수정': '사업 (기회) 등록')
                                    }
                                    </Modal.Title>
                                </Modal.Header> 
                                <Modal.Body>
                                    <div className='inputField modalcntnt'>
                                        <div className='btnArea text-lg-end'>
                                            <Button variant='warning' className='mb-3'>사업 (기회) 복제</Button>
                                        </div>
                                        <div className='searchItem bizoppArea'>
                                            <>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={4} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='사업 일련 번호'>
                                                        <Form.Control name='a_biz_opp_id' size='sm' type='text' className=''
                                                        placeholder='사업 일련 번호'
                                                        onChange={f_handlingInput} 
                                                        // value={input.biz_opp_id}
                                                        defaultValue={updated_v_modalPropsData?.a_biz_opp_id || ''} 
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={8} lg={8} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='사업 (기회) 명'>
                                                        <Form.Control as='textarea' name='a_biz_opp_name' size='sm' type='text' className=''
                                                        placeholder='사업 (기회) 명'
                                                        onChange={f_handlingInput} 
                                                        // value={input.biz_opp_name || ''}
                                                        defaultValue={updated_v_modalPropsData?.a_biz_opp_name || ''} 
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='본부'>
                                                        <Form.Control name='a_high_dept_name' size='sm' type='text' className='' placeholder='본부'
                                                        onChange={f_handlingInput}
                                                        // value={input.high_dept_name}
                                                        defaultValue={updated_v_modalPropsData?.a_high_dept_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='소속 팀'>
                                                        <Form.Control name='a_dept_name' size='sm' type='text' className='' placeholder='소속 팀'
                                                        onChange={f_handlingInput}
                                                        // value={input.dept_name || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_dept_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='영업 담당자'>
                                                        <Form.Control name='a_user_name' size='sm' type='text' className='' placeholder='영업 담당자'
                                                        onChange={f_handlingInput} 
                                                        // value={input.user_name || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_user_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='최종 고객사 (선택)'>
                                                        <Form.Control name='a_last_client_com2_name' size='sm' type='text' className='' placeholder='최종 고객사 (선택)'
                                                        onChange={f_handlingInput} 
                                                        // onCompositionStart={handleCompositionStart}
                                                        // onCompositionEnd={handleCompositionEnd}
                                                        // value={input.last_client_com2_name || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_last_client_com2_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출처'>
                                                        <Form.Control name='a_sale_com2_name' size='sm' type='text' className='' placeholder='매출처'
                                                        onChange={f_handlingInput}
                                                        // value={input.sale_com2_name || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_sale_com2_name || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <Form.Label htmlFor='inputChck2'>필달 여부</Form.Label>
                                                    <Form.Check type={`checkbox`} id={`inputChck2`} name='a_essential_achievement_tf' 
                                                    onChange={f_handlingInput}
                                                    // checked={input.essential_achievement_tf || false} 
                                                    defaultChecked={updated_v_modalPropsData?.a_essential_achievement_tf || false}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='진행률'>
                                                        <Form.Select size='sm' aria-label='selectBox' className='' name='a_progress2_rate_name' 
                                                        onChange={f_handlingInput} 
                                                        // value={input.progress2_rate_name || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_progress2_rate_name || ''}
                                                        >
                                                            <option value={(updated_v_modalPropsData ? updated_v_modalPropsData.a_progress2_rate_name : '선택')}>{(updated_v_modalPropsData ? updated_v_modalPropsData.a_progress2_rate_name : '선택')}</option>
                                                            <option value='1'>One</option>
                                                            <option value='2'>Two</option>
                                                            <option value='3'>Three</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='판품 번호'>
                                                        <Form.Control disabled name='a_sale_item_no' size='sm' type='text' className='' placeholder='판품 번호'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_item_no || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_sale_item_no || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='계약 일자'>
                                                        <Form.Control name='a_contract_date' size='sm' type='date' className='' placeholder='계약 일자'
                                                        onChange={f_handlingInput}
                                                        // value={input.contract_date || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_contract_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 일자'>
                                                        <Form.Control name='a_sale_date' size='sm' type='date' className='' placeholder='매출 일자'
                                                        onChange={f_handlingInput}
                                                        // value={input.sale_date || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_sale_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매입 일자'>
                                                        <Form.Control name='a_purchase_date' size='sm' type='date' className='' placeholder='매입 일자'
                                                        onChange={f_handlingInput}
                                                        // value={input.purchase_date || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_purchase_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='수금 일자 (선택)'>
                                                        <Form.Control name='a_collect_money_date' size='sm' type='date' className='' placeholder='수금 일자 (선택)'
                                                        onChange={f_handlingInput}
                                                        // value={input.collect_money_date || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_collect_money_date || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 금액'>
                                                        <Form.Control name='a_sale_amt' size='sm' type='text' className='' placeholder='매출 금액'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_amt || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_sale_amt || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매입 금액'>
                                                        <Form.Control name='a_purchase_amt' size='sm' type='text' className='' placeholder='매입 금액'
                                                        onChange={f_handlingInput}
                                                        // value={input.a_purchase_amt || ''}
                                                        defaultValue={updated_v_modalPropsData?.a_purchase_amt || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='매출 이익'>
                                                        <Form.Control name='a_sale_profit' size='sm' type='text' className='' placeholder='매출 이익'
                                                        onChange={f_handlingInput} 
                                                        // value={input.sale_profit || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_sale_profit || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='사업 구분'>
                                                        <Form.Select size='sm' aria-label='사업 구분' className='' name='a_biz_section2_name' 
                                                        onChange={f_handlingInput} 
                                                        // value={input.biz_section2_name || ''}
                                                        defaultValue={updated_v_modalPropsData?.a_biz_section2_name || ''}
                                                        >
                                                            <option value={(updated_v_modalPropsData ? updated_v_modalPropsData.a_biz_section2_name : '선택')}>{(updated_v_modalPropsData ? updated_v_modalPropsData.a_biz_section2_name : '선택')}</option>
                                                            <option value='1'>One</option>
                                                            <option value='2'>Two</option>
                                                            <option value='3'>Three</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='제품'>
                                                        <Form.Select size='sm' aria-label='selectBox' className='' name='a_product2_name'
                                                        onChange={f_handlingInput} 
                                                        // value={input.product2_name || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_product2_name || ''}
                                                        >
                                                            <option value={(updated_v_modalPropsData ? updated_v_modalPropsData.a_product2_name : '선택')}>{(updated_v_modalPropsData ? updated_v_modalPropsData.a_product2_name : '선택')}</option>
                                                            <option value='1'>One</option>
                                                            <option value='2'>Two</option>
                                                            <option value='3'>Three</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                {/* <Col xs={12} md={6} lg={4} className='col d-flex align-items-center floating'>
                                                    <FloatingLabel label='비고 (선택)'>
                                                        <Form.Control as='textarea' name='비고' size='sm' type='text' className='' placeholder='비고 (선택)'
                                                        onChange={f_handlingInput} 
                                                        // value={input.비고 || ''} 
                                                        defaultValue={updated_v_modalPropsData?.비고 || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col> */}
                                            </Row>
                                            </>
                                        </div>
                                        <div className='searchItem activityArea'>
                                            <Row className='d-flex justify-content-between'>
                                                <Col xs={12} md={12} lg={12} className='activity col d-flex align-items-center floating'>
                                                    <FloatingLabel label='활동 내역 신규 입력'>
                                                        <Form.Control as='textarea' name='a_activity_details' size='sm' type='text' className='' placeholder='활동 내역 신규 입력'
                                                        onChange={f_handlingInput} 
                                                        // value={input.활동 내역 || ''} 
                                                        defaultValue={updated_v_modalPropsData?.a_activity_details || ''}
                                                        />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>
                                            <Row className='d-flex justify-content-between'>
                                                <h3>활동 내역 이력 &#40;최근 5건&#41;</h3>
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
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className='btnArea justify-content-center'>
                                    <Button variant='primary' onClick={(e) => f_submitData('post', endpoint, changeInput, e)}>저장</Button>
                                    <Button variant='danger' onClick={f_warningMsg}>삭제</Button>
                                    <Button variant='secondary' onClick={onHide}>닫기</Button>
                                </Modal.Footer>
                            </Modal>
                        );
                        break;
                    default:
                        setVHandlingHtml(<h1>안녕하세요 InputFieldDetail.js 작업 중입니다.</h1>);
                }
                
            // }
        };

        updateUI();
    }, [/* currentPath */, show, onHide, input, /* changeInput */, /* v_modalPropsData */, /* mode */]);

    return (
        <div id='inputFieldDetail'>
            {v_handlingHtml}
        </div>
    );
};

export default InputFieldDetail;
