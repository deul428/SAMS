import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
    name: 'location',
    initialState: {
        currentPath: '/', // 기본 경로
    },
    reducers: {
        setLocation: (state, action) => {
            state.currentPath = action.payload;
        }
    }
})

export const { setLocation } = locationSlice.actions;
// 비동기 액션 생성
export const asyncSetLocation = (path) => async (dispatch) => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // 비동기 동작을 시뮬레이션
    dispatch(setLocation(path));
};

export default locationSlice.reducer;