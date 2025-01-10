import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/AuthSlice';
import { Button } from 'react-bootstrap';
import ci from '../assets/img/AJ_ICT.svg';
import '../styles/_home.scss';
export default function Home() {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    console.log(`AuthHome.js: ${JSON.stringify(auth)}`);
    return (
        <div id='home' className='wrap'>
            {auth.isLoggedIn ?
                (
                    <>
                    <img className='ci' src={ci} alt={`AJICT_CI`} />
                    <h2>안녕하세요, {auth.userName} &#40;{auth.userId}&#41;님.</h2>
                    <h2>좌측 헤더에서 메뉴를 선택하세요.</h2>
                    {/* <Button variant='warning' onClick={() => dispatch(logout())}>LogOut</Button> */}
                    </>
                ) :
                (
                    <>
                    <h1>Please Log-in.{auth.userId}</h1>
                    </>
                )
            }
        </div>
    );
}

// export default Home;