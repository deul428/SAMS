import { createSlice } from '@reduxjs/toolkit';
import { apiMethods } from '../../utils/api';
// id, pw, 로그인 사용자 이름, 권한 코드, 부서 코드, 직책 코드
const initialState  = {
    isLoggedIn: false,
    userId: '',
    userPw: '',
    userName: '',
    userAuthCode: '',
    userDeptCode: '',
    userResCode: '',
};

// redux toolkit 제공 함수인 createSlice()를 사용할 시, 정의한 reducer와 동일한 name의 액션 생성자가 같이 생성됨. ex) login(state,action){...} reducer 생성 시 login이라는 액션 생성자가 생성됨.
// login 액션 생성자 내부 { type: 'auth/login', payload: {userId: '유저 아이디', userPw: '유저 패스워드'}}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            // console.log('action: auth.login', action.payload);  
            state.isLoggedIn = true;
            state.userId = action.payload.userId;
            state.userPw = action.payload.userPw;
            state.userName = action.payload.userName;
            state.userAuthCode = action.payload.userAuthCode;
            state.userDeptCode = action.payload.userDeptCode;
            state.userResCode = action.payload.userResCode;
        },
        // 추가적으로 데이터를 받을 필요가 없을 때는 action을 파라미터로 줄 필요가 없음.
        logout(state) {
            // console.log('action: auth.logout');
            state.isLoggedIn = false;
            state.userId = '';
            state.userPw = '';
            state.userResCode = '';
            state.userDeptCode = '';
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;