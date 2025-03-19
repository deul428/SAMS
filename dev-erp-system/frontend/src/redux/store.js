// store 생성, reducer() 정의
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AuthSlice from './reducers/AuthSlice';
import LocationSlice from './reducers/LocationSlice';

// 여러 리듀서를 하나로 결합
const rootReducer = combineReducers({
    auth: AuthSlice,      // 로그인 정보는 auth에 저장
    location: LocationSlice,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;