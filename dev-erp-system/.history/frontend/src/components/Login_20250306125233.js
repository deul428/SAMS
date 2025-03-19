import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { login } from '../redux/reducers/AuthSlice';
import roots from '../utils/datas/Roots';
import { apiMethods } from '../utils/api';

import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { ArrowRight, Person } from 'react-bootstrap-icons';
import ci from '../assets/img/AJ_ICT.svg';
import { useRef } from 'react';

const AuthLogin = () => {
    const navigate = useNavigate(); // 페이지 이동에 사용
    const location = useLocation(); // 현재 경로 정보를 가져옴
    const dispatch = useDispatch(); // Redux 액션 호출에 사용

    const [redirect, setRedirect] = useState(null);
    const [isBeginningLogin, setIsBeginningLogin] = useState(false);
    const auth = useSelector((state) => state.auth);


    const p_login = {
        a_user_id: '',
        a_cipher: '',
    }
    const p_changePw = {
        a_user_id: '',
        a_old_cipher: '',
        a_new_cipher: '',
        a_session_user_id: '',
    }
    const [input, setInput] = useState(p_login);
    const [pwInput, setPwInput] = useState(p_changePw);
    const endpoint = roots.login.endpoint;

    useEffect(() =>{
        console.log('input:', input,'\npwInput:', pwInput);
    }, [input, pwInput])


    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        // input 업데이트
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value.trim(),
        }));
    
        // pwInput 업데이트
        setPwInput((prevPwInput) => {
            /* const updatedPwInput = {
                ...prevPwInput,
                [name]: value.trim(),
            };
            console.log(updatedPwInput.a_user_id, prevPwInput.a_user_id)
    
            // a_old_cipher는 input.a_cipher를 복사, a_cipher를 pwInput에서 제거
            if (name === "a_cipher") {
                updatedPwInput.a_old_cipher = value.trim();
                delete updatedPwInput[name];
            } else if (!updatedPwInput.a_old_cipher && prevPwInput.a_cipher) {
                updatedPwInput.a_old_cipher = prevPwInput.a_cipher.trim();
            }
    
            // ✅ a_session_user_id를 prevPwInput 기반으로 설정하여 input 비동기 문제 해결
            if (prevPwInput.a_user_id) {
                updatedPwInput.a_session_user_id = prevPwInput.a_user_id.trim();
            }
    
            return updatedPwInput; */
            const updatedPwInput = {
                ...prevPwInput,
                [name]: value.trim(),
            };
    
            // a_old_cipher는 input.a_cipher를 복사, a_cipher를 pwInput에서 제거
            if (name === "a_cipher") {
                updatedPwInput.a_old_cipher = value.trim();
                delete updatedPwInput[name];
            } else if (!updatedPwInput.a_old_cipher && input.a_cipher) {
                updatedPwInput.a_old_cipher = prevPwInput.a_cipher.trim();
            } else if (prevPwInput.a_user_id) {
                updatedPwInput.a_session_user_id = prevPwInput.a_user_id.trim();
            }
            return updatedPwInput;
        });
    };
    
    // 바닥 페이지 비우기
    // 로그인했을 때 사용자 정보 세션마다 돌게 
    // 사업기회조회 어드민 아니면 권한 맞는 조회 조건만 보이게 

    // 유효값 체크 및 로그인 후 경로 리디렉션
    // 11.26. 리디렉션 처리 안 되고 있으니 다시 확인해 보기.
    const f_submitData = async (method, endpoint, input = null, e, firstLoggedIn) => {
        e.preventDefault(); // submit 방지
        try {
            // 최초 로그인 비밀번호 변경 로직
            if (firstLoggedIn) {
                // 유효값 검사
                const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{5,}$/;
                if (!passwordRegex.test(pwInput.a_new_cipher)) {
                    alert('비밀번호는 영문 소문자와 숫자를 조합하여 5자 이상으로 입력해 주십시오. (영문 대문자, 특수문자 불가)');
                    return;
                }
                if (pwInput.a_new_cipher === "") {
                    alert(`변경하려는 비밀번호를 입력하세요.`);
                    return;
                }
                if (pwInput.a_new_cipher === pwInput.a_old_cipher) {
                    alert(`현재 비밀번호와 변경하려는 비밀번호가 동일합니다. 다른 비밀번호를 입력하세요.`);
                    return;
                } 
                /* if (!pwInput.a_session_user_id) {
                    alert(`세션 아이디가 비어 있습니다. (디버깅용)`);
                    return;
                } */
                if(window.confirm('비밀번호를 변경하시겠습니까?')) {
                    const response = await apiMethods[method]('update-cipher-change/', pwInput);
                    await dispatch(login({ ...auth, userId: auth.userId, userPw: pwInput.a_new_cipher }));
    
                    setTimeout(() => {
                        console.log(response);
                        alert('비밀번호가 변경되었습니다.');
                        // 이전 경로로 리디렉션
                        const from = location.state?.from?.pathname || `/${roots.home.url}`;
                        setRedirect(from);
                        return response;
                    }, 1000);
                } else {
                    return;
                }
            } else {
                if (!input.a_user_id || !input.a_cipher) {
                    alert(`아이디, 패스워드를 입력하세요.`);
                    return;
                }
                // API 호출
                const response = await apiMethods[method](endpoint, input);
                if(response.length === 1) {
                    alert(response[0].MESSAGE);
                    return;
                }
                let res = response[0][0];
                let resStts = response[1][0];

                // 로그인 성공 시 객체 length 2. (데이터부, 상태부)
                if (response.length === 2) {
                    console.log("로그인 성공.", "\nresponse (data): ", res, "\nresponse (msg): ", resStts);
                    if (resStts.STATUS === 'LOGIN') {
                        // Redux에 로그인 정보 저장
                        await dispatch(login({ userId: input.a_user_id, userPw: input.a_cipher, userName: res.user_name, userResCode: res.responsibility2_code, userDeptCode: res.dept_id, userAuthCode: res.auth2_code }));

                        if (res.beginning_login_tf) {
                            if (window.confirm('최초 로그인 시 비밀번호를 변경해야 합니다. 지금 변경하시겠습니까?')) {
                                setIsBeginningLogin(true);
                            } else {
                                return;
                            }
                        } else {
                            // 이전 경로로 리디렉션
                            const from = location.state?.from?.pathname || `/${roots.home.url}`;
                            setRedirect(from);
                            return response;
                            // const session = localStorage.setItem("sessionid", response.data.sessionid);
                            // console.log("session: ", response.data.sessionid)
                            // console.log(location.state?.from?.pathname);
                        }
                    }
                } else if (response[0].STATUS === 'FAIL') {
                    console.log("로그인 실패.\nresponse: ", response, response[0].STATUS)
                    // 실패 메시지 알림
                    alert(response[0].MESSAGE || '알 수 없는 오류가 발생했습니다.');
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

    const prevAuth = useRef(false);
    useEffect(() => {
        console.log(prevAuth.current, auth);
        // logout시 초기화
        if (prevAuth === true && auth.isLoggedIn === false) {
            setInput(p_login);
            setPwInput(p_changePw);
            return;
        }
        prevAuth.current = auth;
    }, [auth])

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
                            <Form.Control type='id' name='a_user_id' placeholder='id' id='inputId' /* value={input.a_user_id} */ onChange={f_handlingInput}/>
                        </FloatingLabel>
                    </div>
                    <div className='inputFields pwField'>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password' name='a_cipher' placeholder='Password' id='inputPw' /* value={input.a_cipher} */ onChange={f_handlingInput}/>
                        </FloatingLabel>
                        <Form.Text id='passwordHelpBlock' muted>
                            영문 소문자, 숫자를 조합하여 5자 이상 비밀번호를 입력해 주십시오. (특수문자 불가)
                        </Form.Text>
                        <Form.Text id='passwordHelpBlock' muted>
                            아이디/비밀번호 분실 시 관리자에게 문의하십시오.
                        </Form.Text>
                    </div>
                    <Button type='submit' variant='primary' onClick={(e) => f_submitData('post', endpoint, input, e, false)}>로그인</Button>
                </form>
                ) :
                (
                <form id='changeLoginArea'>
                    <h3 style={{textAlign: 'center'}}>비밀번호 변경</h3>
                    <h4 style={{textAlign: 'center'}}>최초 로그인 시 비밀번호를 변경하셔야 합니다.</h4>
                    <h4 style={{textAlign: 'center', marginBottom: '1rem'}}>변경할 비밀번호를 입력해 주시기 바랍니다.</h4>
                    <div className='inputFields idField'>
                        <FloatingLabel label='ID' className='mb-3'>
                            <Form.Control type='id' name='a_user_id' placeholder='id' id='inputPwChangeId' /* value={pwInput.a_user_id}  */onChange={(e) => f_handlingInput(e, false)} disabled/>
                        </FloatingLabel>
                    </div>
                    <div className='inputFields pwField'>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password' name='a_new_cipher' placeholder='Password' id='inputPwChangePw' /* value={pwInput.a_new_cipher} */ onChange={f_handlingInput}/>
                        </FloatingLabel>
                        <Form.Text id='passwordHelpBlock' muted>
                            영문 소문자, 숫자를 조합하여 5자 이상 비밀번호를 입력해 주십시오. (특수문자 불가)
                        </Form.Text>
                    </div>
                    <Button type='submit' variant='primary' onClick={(e) => f_submitData('post', endpoint, pwInput, e, true)}>비밀번호 변경</Button>
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