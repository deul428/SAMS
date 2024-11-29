import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { login } from '../redux/reducers/AuthSlice';
import roots from '../utils/datas/Roots';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { ArrowRight, Person } from 'react-bootstrap-icons';
import ci from '../assets/img/AJ_ICT.svg';
import { apiMethods } from '../utils/api';

const AuthLogin = () => {
    const navigate = useNavigate(); // 페이지 이동에 사용
    const location = useLocation(); // 현재 경로 정보를 가져옴
    const dispatch = useDispatch(); // Redux 액션 호출에 사용
    const [redirect, setRedirect] = useState(null);

    const p_login = {
        userId: '',
        userPw: '',
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

    // 유효값 체크 및 로그인 후 경로 리디렉션
    // 11.26. 리디렉션 처리 안 되고 있으니 다시 확인해 보기.
    const f_submitLoginData = async (method, endpoint, input = null, e) => {
        e.preventDefault(); // submit 방지
        try {
            if (!input.userId || !input.userPw) {
                alert(`아이디, 패스워드를 입력하세요.`);
                return;
            }
            const response = await apiMethods[method](endpoint, input);
            console.log(response);
            // if (response.STATUS === 'SUCCESS') {
                // login reducers로 액션 전송(유저 상태 값 redux에 저장, 전역 상태 관리)
            await dispatch(login({userId1: input.userId, userPw1: input.userPw}));
            
            // 로그인 시 이전 경로로 리디렉션
            const from = location.state?.from?.pathname || `/${roots[4].depth1}/`;
            console.log(from);
            setRedirect(from);
            // } else {
            //     alert(response.MESSAGE);
            // }
            return response;
        } catch (error) {
            console.log("error!!!", error);
        }
    };
    useEffect(() => {
        console.log("Redirect Path:", redirect); // 확인
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
                            <Form.Control type='id' name='userId' placeholder='id' id='inputId' value={input.userId} onChange={f_handlingInput}/>
                        </FloatingLabel>
                    </div>
                    <div className='inputFields pwField'>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password' name='userPw' placeholder='Password' id='inputPw' value={input.userPw} onChange={f_handlingInput}/>
                        </FloatingLabel>
                        <Form.Text id='passwordHelpBlock' muted>
                            영문, 숫자를 조합하여 5자 이상 비밀번호를 입력해 주십시오. (특수문자 미포함)
                        </Form.Text>
                    </div>
                    <Button type="submit" variant="primary" onClick={(e) => f_submitLoginData('post', endpoint, input, e)}>로그인</Button>
                {/* </form> */}
                </form>
                {/* react에서는 input-label을 이을 때 label id 값이 아닌 htmlFor를 사용한다. */}
                {/* 최초 로그인 여부 true이면 비밀번호 변경 팝업 */}
            </div>
        </div>
    );
}

export default AuthLogin;