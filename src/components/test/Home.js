import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/reducers/AuthSlice';
import { Button } from 'react-bootstrap';

export function Home() {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    console.log(`AuthHome.js: ${JSON.stringify(auth)}`);
    return (
        <div>
            {auth.isLoggedIn1 ?
                (
                    <div>
                        <h1>hello, {auth.userId1}!</h1>
                        <Button variant='warning' onClick={() => dispatch(logout())}>LogOut</Button>
                    </div>
                ) :
                (
                    <div>
                        <h1>Please Log-in.{auth.userId1}</h1>
                    </div>
                )
            }
        </div>
    );
}

export default Home;