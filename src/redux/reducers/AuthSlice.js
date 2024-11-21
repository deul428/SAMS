import { createSlice } from '@reduxjs/toolkit';

const initialState  = {
    isLoggedIn1: false,
    userId1: '',
    userPw1: '',
};

// redux toolkit 제공 함수인 createSlice()를 사용할 시, 정의한 reducer와 동일한 name의 액션 생성자가 같이 생성됨. ex) login(state,action){...} reducer 생성 시 login이라는 액션 생성자가 생성됨.
// login 액션 생성자 내부 { type: 'auth/login', payload: {userId1: '유저 아이디', userPw1: '유저 패스워드'}}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            console.log('action: auth.login', action.payload);  
            state.isLoggedIn1 = true;
            state.userId1 = action.payload.userId1;
            state.userPw1 = action.payload.userPw1;
        },
        // 추가적으로 데이터를 받을 필요가 없을 때는 action을 파라미터로 줄 필요가 없음.
        logout(state) {
            console.log('action: auth.logout');
            state.isLoggedIn1 = false;
            state.userId1 = '';
            state.userPw1 = '';
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;