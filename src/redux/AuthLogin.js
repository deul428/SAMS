// import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { login } from './login/AuthSlice';

import { Form, Button } from 'react-bootstrap';
import { ArrowRight, Person } from 'react-bootstrap-icons';


import ci from '../assets/img/AJ_ICT.svg';

const AuthLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitLoginData = (e) => {
        e.preventDefault();
        let userId = document.getElementById('inputId').value;
        let userPw = document.getElementById('inputPw').value;
        console.log(userId, userPw);
        // 유효성 검사: Falsy value 처리 (null, undefined, '')
        if (!userId || !userPw) {
            alert(`ID, Password를 입력하세요.`);
            return;
        }
        dispatch(login({userId1: userId, userPw1: userPw}));
        navigate('/home');
    } 
    return (
        <div id='login' className='Wrap'>
            <div id='loginArea'>
                {/* <Link to='/'> */}
                    <img className='ci' src={ci} alt={`AJICT_CI`} ></img>
                {/* </Link> */}
                {/* <ArrowRight color="royalblue" size={96} /> */}
                <form>
                    <div className='inputFields idField'>
                        <Form.Label htmlFor='inputId'>ID</Form.Label>
                        <Form.Control type='id' id='inputId' placeholder='User ID'/>
                    </div>
                    <div className='inputFields pwField'>
                        <Form.Label htmlFor="inputPw"  >Password</Form.Label>
                        <Form.Control type="password" id="inputPw" placeholder='Password'
                        aria-describedby="passwordHelpBlock"
                        />
                        <Form.Text id="passwordHelpBlock" muted>
                        Your password must be 8-20 characters long, contain letters and numbers,
                        and must not contain spaces, special characters, or emoji.
                        </Form.Text>
                    </div>
                    <Button type='submit' variant="primary" onClick={submitLoginData}>확인</Button>
                </form>
                {/* react에서는 input-label을 이을 때 label id 값이 아닌 htmlFor를 사용한다. */}
            </div>
        </div>
    );
}

export default AuthLogin;