import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { login } from '../redux/reducers/AuthSlice';
import roots from '../utils/datas/Roots';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { ArrowRight, Person } from 'react-bootstrap-icons';
import ci from '../assets/img/AJ_ICT.svg';

const AuthLogin = () => {
    const navigate = useNavigate(); // 페이지 이동에 사용
    const location = useLocation(); // 현재 경로 정보를 가져옴
    const dispatch = useDispatch(); // Redux 액션 호출에 사용
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        console.log("Redirect Path:", redirect);
        if (redirect) {
            navigate(redirect, { replace: true });
        }
    }, [redirect, navigate]);
    

    // 유효값 체크 및 로그인 후 경로 리디렉션
    // 11.26. 리디렉션 처리 안 되고 있으니 다시 확인해 보기.
    const f_submitLoginData = async (e) => {
        e.preventDefault();
        let userId = document.getElementById('inputId').value;
        let userPw = document.getElementById('inputPw').value;
        console.log(userId, userPw);
        // 유효성 검사: Falsy value 처리 (null, undefined, '')
        if (!userId || !userPw) {
            alert(`아이디, 패스워드를 입력하세요.`);
            return;
        }
        await dispatch(login({userId1: userId, userPw1: userPw}));

        // 로그인 시 이전 경로로 리디렉션
        const from = location.state?.from?.pathname || '/biz-opp';
        setRedirect(from);
    } 
    

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
                            <Form.Control type='id' placeholder='id' id='inputId' />
                        </FloatingLabel>
                    </div>
                    <div className='inputFields pwField'>
                        <FloatingLabel label='Password'>
                            <Form.Control type='password' placeholder='Password' id='inputPw' />
                        </FloatingLabel>
                        <Form.Text id='passwordHelpBlock' muted>
                            영문과 숫자를 조합하여 5~20자리 비밀번호를 입력해 주십시오.
                        </Form.Text>
                    </div>
                    <Button type='submit' variant='primary' onClick={f_submitLoginData}>확인</Button>
                </form>
                {/* react에서는 input-label을 이을 때 label id 값이 아닌 htmlFor를 사용한다. */}
            </div>
        </div>
    );
}

export default AuthLogin;