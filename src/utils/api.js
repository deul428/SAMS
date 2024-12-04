import axios from 'axios';

// 데이터 흐름: 사용자가 특정 트리거(예: 버튼 클릭)를 통해 API 요청을 보내면, 컴포넌트에서 api.js의 공통 모듈을 호출하여 요청을 처리하는 방식
// 컴포넌트에서 사용하는 useEffect 훅: useEffect는 랜더링 이후에 실행됨. -> UI  업데이트 후 데이터를 가지고 오는 비동기 작업 처리.
    // 변경 값 빈 배열: 컴포넌트가 처음 렌더링 시 한 번만 실행됨. 이 의존성 배열에 값이 있을 경우 해당 값 변경 시마다 useEffect 훅 다시 실행됨.

// axios 인스턴스 생성
const apiUrl = axios.create({
    // baseURL: 'http://127.0.0.1:8000/',
    baseURL: 'http://10.0.60.201:8000/',
    // baseURL:'http://192.10.100.100:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: "include", // 세션 쿠키 포함
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
            console.log('api 부');
            if (method === 'post') {
                console.log(data);
                // if (Object.values(data).some(e => !e)){
                //     alert(`user input is Null or ''.`);
                // }
                // return;
            };
            const response = await apiUrl({ method, url, data });
            if (method !== 'get') {
                console.log(`API Endpoint: ${url}\nData: ${JSON.stringify(data, null, 2)}`);
            } else {
                console.log(`API Get\nresponse: `, response);
            }
            console.log('api 부 끝');
            return response.data;
        } catch (error) {
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