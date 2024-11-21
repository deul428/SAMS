// 로그인되지 않았을 경우 로그인 페이지로 이동, 로그인 후 원래 경로로 리디렉션하기 위해 state 정보 저장 
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const Auth = ({children}) => {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    return (!auth.isLoggedIn1 ? <Navigate to='/biz-opp' state={{from: location}} /> : children);
}

export default Auth;