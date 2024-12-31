import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { login } from '../../redux/reducers/AuthSlice';
import roots from '../../utils/datas/Roots';
import { apiMethods } from '../../utils/api';
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
    const [input, setInput] = useState(p_login);
    const endpoint = 'login/';

    
    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
        });
    }

    // 바닥 페이지 비우기
    // 로그인했을 때 사용자 정보 세션마다 돌게 
    // 사업기회조회 어드민 아니면 권한 맞는 조회 조건만 보이게 

    // 유효값 체크 및 로그인 후 경로 리디렉션
    // 11.26. 리디렉션 처리 안 되고 있으니 다시 확인해 보기.
    const f_submitData = async (method, endpoint, input = null, e) => {
        e.preventDefault(); // submit 방지
        try {
            if (!input.a_user_id || !input.a_cipher) {
                alert(`아이디, 패스워드를 입력하세요.`);
                return;
            }
            // API 호출
            const response = await apiMethods[method](endpoint, input);
            console.log(response, [response].length);
            console.log(response[1].STATUS, "beginning_login_tf: ", response[0].beginning_login_tf);
    
            // 응답 데이터 검증 및 처리
            if (response.length === 2 && response[1].STATUS === 'SUCCESS') {
                // Redux에 로그인 정보 저장
                await dispatch(login({ userId: input.a_user_id, userPw: input.a_cipher }));
                if (!response[0].beginning_login_tf) {
                    console.log("최초로그인입니다!!!");
                    setIsBeginningLogin(true);
                }

                // 이전 경로로 리디렉션
                // const from = location.state?.from?.pathname || `/${roots.bizopp.depth1}/`;
                // console.log('Redirect Path:', from);
                // setRedirect(from);
            } else if (response.STATUS === 'NONE') {
                // 실패 메시지 알림
                alert(response.MESSAGE || '알 수 없는 오류가 발생했습니다.');
            } else {
                alert('서버로부터 올바른 응답을 받지 못했습니다.');
            }
    
            return response;
        } catch (error) {
            console.log('Error during login:', error);
            alert('로그인 중 오류가 발생했습니다. 관리자에게 문의하세요.');
        }
    };
    
    
    // const f_submitData = async (method, endpoint, input = null, e) => {
    //     e.preventDefault(); // submit 방지
    //     try {
    //         if (!input.a_user_id || !input.a_cipher) {
    //             alert(`아이디, 패스워드를 입력하세요.`);
    //             return;
    //         }
    //         const response = await apiMethods[method](endpoint, input);
    //         console.log([...response]);
    //         if (response.STATUS === 'SUCCESS') {
    //             // login reducers로 액션 전송(유저 상태 값 redux에 저장, 전역 상태 관리)
    //             await dispatch(login({userId: input.a_user_id, userPw: input.a_cipher}));
            
    //             // 로그인 시 이전 경로로 리디렉션
    //             const from = location.state?.from?.pathname || `/${roots.bizopp.depth1}/`;
    //             console.log(from);
            
    //             setRedirect(from);
    //         } else {
    //             // response.MESSAGE가 있는 경우 출력
    //             const errorMessage = response[1].MESSAGE || '오류가 발생했습니다.';
    //             console.log(errorMessage);
    //             alert(errorMessage);
    //         }
    //         return response;
    //     } catch (error) {
    //         console.log('error!!!', error);
    //     }
    // };
    useEffect(() => {
        console.log('Redirect Path:', redirect); // 확인
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
                <form>
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
                    <Button type='submit' variant='primary' onClick={(e) => f_submitData('post', endpoint, input, e)}>로그인</Button>

                {/* </form> */}
                </form>
                {/* {isBeginningLogin && */}
                <>
                    <h2></h2>
                    <form>
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
                                최초 로그인 시 비밀번호를 변경하셔야 합니다. 변경할 비밀번호를 입력해 주시기 바랍니다.
                                영문, 숫자를 조합하여 5자 이상 비밀번호를 입력해 주십시오. (특수문자 미포함)
                            </Form.Text>
                        </div>
                        <Button type='submit' variant='primary' onClick={(e) => f_submitData('post', endpoint, input, e)}>로그인</Button>
                    </form>
                </>
                {/* } */}
                {/* react에서는 input-label을 이을 때 label id 값이 아닌 htmlFor를 사용한다. */}
                {/* 최초 로그인 여부 true이면 비밀번호 변경 팝업 */}
            </div>
        </div>
    );
}

export default AuthLogin;