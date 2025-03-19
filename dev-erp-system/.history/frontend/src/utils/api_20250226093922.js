import axios from 'axios';

// 데이터 흐름: 사용자가 특정 트리거(예: 버튼 클릭)를 통해 API 요청을 보내면, 컴포넌트에서 api.js의 공통 모듈을 호출하여 요청을 처리하는 방식
// 컴포넌트에서 사용하는 useEffect 훅: useEffect는 랜더링 이후에 실행됨. -> UI  업데이트 후 데이터를 가지고 오는 비동기 작업 처리.
    // 변경 값 빈 배열: 컴포넌트가 처음 렌더링 시 한 번만 실행됨. 이 의존성 배열에 값이 있을 경우 해당 값 변경 시마다 useEffect 훅 다시 실행됨.

// axios 인스턴스 생성
const apiUrl = axios.create({
    baseURL: 'http://127.0.0.1:8000/', 
    // baseURL: 'http://10.0.60.62:8000/',
    // baseURL: 'http://10.0.60.201:8000/',
    credentials: "include", // 세션 쿠키 포함
    // withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    },
})


/*- HTTP method
1. get
    await api.request('get', url)
2. post
    await api.request('post', url, 새로 추가할 데이터)
3. put
    await api.request('put', url/params, 수정할 데이터)
4. delete
    await api.request('delete', url/params)
-*/
const api = {
    request: async (method, url, data = null) => {
        try {
            /* if (method === 'post') {
                console.log(data);
                // if (Object.values(data).some(e => !e)){
                //     alert(`user input is Null or ''.`);
                // }
                // return;
            }; */
            const response = await apiUrl({ method, url, data });
            const cookies = document.cookie;
            // const test = response.set_cookie('csrftoken', 'your_token_value', secure=True, httponly=True, samesite='Lax');

            // console.log(cookies, test);
            
            if (method !== 'get') {
                console.log(`API Post/Patch/Put/Del (송신)\nEndpoint (출처): ${url}\nData:`, data);
            } /* else {
                console.log(`API Get (수신)\nEndpoint:\nresponse: `, response);
            } */
            return response.data;
        } catch (error) {
            const status = error.response?.STATUS;
            if (status === 401) { // 인증 실패
                alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
                // 로그아웃 처리 또는 리다이렉트
                window.location.href = '/login'; // 로그인 페이지로 이동
            } else if (status === 403) { // 권한 부족
                alert("권한이 없습니다.");
            } else if (status === 500) {
                alert("서버를 받아오지 못했습니다.");
            }

            const errMsg = error.response?.data?.message || error.message;
            console.error(`${method} ${url} Error! ${errMsg}`);
            throw new Error(errMsg);
        }
    }
}

export const apiMethods = {
    get: (url) => api.request('get', url),
    post: (url, data) => api.request('post', url, data),
    put: (url, data) => api.request('put', url, data),
    patch: (url, data) => api.request('patch', url, data),
    del: (url) => api.request('delete', url)
};