import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { login } from '../redux/reducers/AuthSlice';
import roots from '../utils/datas/Roots';
import { apiMethods } from '../utils/api';
import ChangePw from './ChangePw';

import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { ArrowRight, Person } from 'react-bootstrap-icons';
import ci from '../assets/img/AJ_ICT.svg';

const AuthLogin = () => {
    const navigate = useNavigate(); // 페이지 이동에 사용
    const location = useLocation(); // 현재 경로 정보를 가져옴
    const dispatch = useDispatch(); // Redux 액션 호출에 사용

    const [redirect, setRedirect] = useState(null);
    const [isBeginningLogin, setIsBeginningLogin] = useState(false);
    const auth = useSelector((state) => state.auth);
    // console.log(auth.isLoggedIn);

    const p_login = {
        a_user_id: '',
        a_cipher: '',
    }
    const p_changePw = {
        a_user_id: '',
        a_old_cipher: '',
        a_new_cipher: '',
    }
    const [input, setInput] = useState(p_login);
    const [pwInput, setPwInput] = useState(p_changePw);
    const endpoint = 'login/';

    const f_handlingInput = (e) => {
        const { name, value } = e.target;
    
        // input 업데이트
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value.trim(),
        }));
    
        // pwInput 업데이트
        setPwInput((prevPwInput) => {
            const updatedPwInput = {
                ...prevPwInput,
                [name]: value.trim(),
            };
    
            // a_old_cipher는 input.a_cipher를 복사
            if (name === "a_cipher") {
                updatedPwInput.a_old_cipher = value.trim();
            } else if (!updatedPwInput.a_old_cipher && input.a_cipher) {
                updatedPwInput.a_old_cipher = input.a_cipher.trim();
            }
    
            // a_user_id와 a_cipher를 pwInput에서 제거
            if (name === "a_cipher") {
                delete updatedPwInput[name];
            }
            // if (name === "a_user_id" || name === "a_cipher") {
            //     delete updatedPwInput[name];
            // }
    
            return updatedPwInput;
        });
    
        console.log(`input: ${JSON.stringify(input, null, 1)},\npwInput: ${JSON.stringify(pwInput, null, 1)}`);
    };
    
    // 바닥 페이지 비우기
    // 로그인했을 때 사용자 정보 세션마다 돌게 
    // 사업기회조회 어드민 아니면 권한 맞는 조회 조건만 보이게 

    // 유효값 체크 및 로그인 후 경로 리디렉션
    // 11.26. 리디렉션 처리 안 되고 있으니 다시 확인해 보기.
    const f_submitLoginData = async (method, endpoint, input = null, e, firstLoggedIn) => {
        e.preventDefault(); // submit 방지
        try {
            // 최초 로그인 비밀번호 변경 로직
            if (firstLoggedIn) {
                if(pwInput.a_new_cipher === pwInput.a_old_cipher) {
                    alert(`현재 비밀번호와 변경하려는 비밀번호가 동일합니다. 다른 비밀번호를 입력하세요.`);
                    return;
                }
                console.log('최초 비밀번호 변경');
                console.log(p_changePw);

                const response = await apiMethods[method]('cipher-change/', pwInput);
                console.log("비밀번호 변경 response: ", response);

                await dispatch(login({ userId: auth.userId, userPw: pwInput.a_new_cipher }));
                console.log("present: ", pwInput.a_new_cipher);
                
                // 이전 경로로 리디렉션
                const from = location.state?.from?.pathname || `/${roots[8].url}`;
                console.log('Redirect Path:', from);
                setRedirect(from);
                return response;
            } else {
                if (!input.a_user_id || !input.a_cipher) {
                    alert(`아이디, 패스워드를 입력하세요.`);
                    return;
                }
                // API 호출
                const response = await apiMethods[method](endpoint, input);
                console.log(response, response.length);
                // 로그인 성공 시 객체 length 2. (데이터부, 상태부)
                if (response.length === 2) {
                    console.log("로그인 성공.\nresponse.length: ", response.length, "response: ", response);
                    if (response[1].STATUS === 'SUCCESS') {
                        console.log(response[0].beginning_login_tf);
                        // Redux에 로그인 정보 저장
                        await dispatch(login({ userId: input.a_user_id, userPw: input.a_cipher }));

                        if (response[0].beginning_login_tf) {
                            console.log(p_changePw);
                            window.confirm('최초 로그인 시 비밀번호를 변경해야 합니다. 지금 변경하시겠습니까?', setIsBeginningLogin(true)); 
                        } else {
                            // 이전 경로로 리디렉션
                            const from = location.state?.from?.pathname || `/${roots[8].url}`;
                            console.log('Redirect Path:', from);
                            setRedirect(from);
                            return response;
                        }
                    }
                } else if (response.STATUS === 'NONE') {
                    console.log("로그인 실패.\nresponse: ", response, response.STATUS)
                    // 실패 메시지 알림
                    alert(response.MESSAGE || '알 수 없는 오류가 발생했습니다.');
                    return;
                } else {
                    alert('서버로부터 올바른 응답을 받지 못했습니다.');
                    return;
                }
            }
            
        } catch (error) {
            console.log('Error during login:', error);
            alert('로그인 중 오류가 발생했습니다. 관리자에게 문의하세요.', error);
        }
    };
    
    
    useEffect(() => {
        // console.log('Redirect Path:', redirect); // 확인
        if (redirect) {
            navigate(redirect, { replace: true });
        }
    }, [redirect, navigate]);
    return (
        <div id='login' className='wrap'>
            <div id='loginArea'>
                <div className='title'>
                    <img className='ci' src={ci} alt={`AJICT_CI`} ></img>
                    <h1>영업관리시스템</h1>
                </div>
                {!isBeginningLogin ? 
                (  
                <form id='defaultLoginArea'>
                    <div className='inputFields idField'>
                        <FloatingLabel label='ID' className='mb-3'>
                            <Form.Control type='id' name='a_user_id' placeholder='id' id='inputId' value={input.a_user_id} onChange={f_handlingInput}/>
                        </FloatingLabel>
                    </div>
                    <div className='inputFields pwField'>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password' name='a_cipher' placeholder='Password' id='inputPw' value={input.a_cipher} onChange={f_handlingInput}/>
                        </FloatingLabel>
                        <Form.Text id='passwordHelpBlock' muted>
                            영문, 숫자를 조합하여 5자 이상 비밀번호를 입력해 주십시오. (특수문자 미포함)
                        </Form.Text>
                    </div>
                    <Button type='submit' variant='primary' onClick={(e) => f_submitLoginData('post', endpoint, input, e, false)}>로그인</Button>
                </form>
                ) :
                (
                <form id='changeLoginArea'>
                    <h3 style={{textAlign: 'center'}}>비밀번호 변경</h3>
                    <h4 style={{textAlign: 'center'}}>최초 로그인 시 비밀번호를 변경하셔야 합니다.</h4>
                    <h4 style={{textAlign: 'center', marginBottom: '1rem'}}>변경할 비밀번호를 입력해 주시기 바랍니다.</h4>
                    <div className='inputFields idField'>
                        <FloatingLabel label='ID' className='mb-3'>
                            <Form.Control type='id' name='a_user_id' placeholder='id' id='inputPwChangeId' value={pwInput.a_user_id} onChange={(e) => f_handlingInput(e, false)}/>
                        </FloatingLabel>
                    </div>
                    <div className='inputFields pwField'>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password' name='a_new_cipher' placeholder='Password' id='inputPwChangePw' value={pwInput.a_new_cipher} onChange={f_handlingInput}/>
                        </FloatingLabel>
                        <Form.Text id='passwordHelpBlock' muted>
                            영문, 숫자를 조합하여 5자 이상 비밀번호를 입력해 주십시오. (특수문자 미포함)
                        </Form.Text>
                    </div>
                    <Button type='submit' variant='primary' onClick={(e) => f_submitLoginData('post', endpoint, pwInput, e, true)}>비밀번호 변경</Button>
                </form>
                )  
            }
                {/* react에서는 input-label을 이을 때 label id 값이 아닌 htmlFor를 사용한다. */}
                {/* 최초 로그인 여부 true이면 비밀번호 변경 팝업 */}
            </div>
        </div>
    );
}

export default AuthLogin;