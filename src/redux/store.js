// store 생성, reducer() 정의
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AuthSlice from './login/AuthSlice';

// 여러 리듀서를 하나로 결합
const rootReducer = combineReducers({
    auth: AuthSlice,      // 로그인 정보는 auth에 저장
    // business: businessReducer, // 사업 정보는 business에 저장
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;