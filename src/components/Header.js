import { Button, ButtonGroup, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/AuthSlice';
import { useState, useEffect } from 'react';
import ci from '../assets/img/AJ_ICT.svg';
import roots from '../utils/datas/Roots';

function Header() {
    // ============== Log-In 처리 ==============
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    function f_logoutConfirm(){
        let v_logoutMsg = window.confirm('정말 로그아웃 하시겠습니까?');
        if(v_logoutMsg === true) {
            dispatch(logout());
        }
    }
    
    // ----------------------- Log-In Mapping -----------------------
        // isLoggedIn === true: User Id Text, Logout Button 생성 
        // isLoggedIn === false: User Id Falsy, Login Button 생성 
    let v_loginInfo = <ButtonGroup><Button variant='primary' href={`/${roots[0].depth1}`}> Login </Button></ButtonGroup>;
    auth.isLoggedIn1 ? 
    (v_loginInfo = 
        <ButtonGroup className='btnLoginInfo'>
            <Button variant='text' className='btnUserId'>
                <Person></Person> {auth.userId1}
            </Button>
            <Button variant='text' className='btnLogout' onClick={f_logoutConfirm}> Logout </Button>
        </ButtonGroup>
    ) : 
    (v_loginInfo = 
        <ButtonGroup><Button variant='primary' href={`/${roots[0].depth1}`}> Login </Button></ButtonGroup>
    )
    // ============== Log-In 처리 끝 ==============
    
    // ============== 클래스 active 처리 ==============
    const [isActive, setIsActive] = useState(false);
    const location = useLocation();
    // useEffect 훅: 컴포넌트 렌더링 or 상태/속성 변경 시 실행되는 작업 처리 영역.
    // location이 변경될 때마다 그 후로 처리되어야 할 작업을 작성함.
    const v_hasChildUrls = [roots[1].depth1, roots[6].depth1];
    useEffect(() => {
        v_hasChildUrls.some(value => location.pathname.includes(value)) ? setIsActive(true) : setIsActive(false);
    }, [location]);
 
    return (
        <>
            <Navbar id='header' fixed='top' bg='primary' v_haschildurls-bs-theme='dark'>
                <Container>
                    <Nav className='brand'>
                        <Navbar.Brand href='#'>
                            <img className='ci' src={ci} alt={`AJICT_CI`} />
                        </Navbar.Brand>
                    </Nav>
                    
                    <Nav className='navMenu'>
                        <div className={`menus ${isActive && location.pathname.includes(roots[1].depth1) ? 'active' : ''} nav-link`} id='menu01'>
                            기본 정보 관리
                            <Nav.Link as={NavLink} className='menuItem' to={`/${roots[1].depth1}/${roots[1].depth2}`}>사용자 관리</Nav.Link>
                            <Nav.Link as={NavLink} className='menuItem' to={`/${roots[2].depth1}/${roots[2].depth2}`}>공통 코드 관리</Nav.Link>
                            <Nav.Link as={NavLink} className='menuItem' id='menu02' to={`/${roots[3].depth1}/${roots[3].depth2}`}>제품 관리</Nav.Link>
                        </div>
                        <Nav.Link as={NavLink} className={`menuItem menus ${location.pathname.includes(roots[4].depth1) ? 'active' : ''}`} id='menu03' to={`/${roots[4].depth1}/${roots[4].depth2}`}>
                            사업 (기회) 관리
                        </Nav.Link>
                        <Nav.Link as={NavLink} className={`menuItem menus ${location.pathname.includes(roots[5].depth1) ? 'active' : ''}`} to={`/${roots[5].depth1}/${roots[5].depth2}`}>
                            영업 활동 관리
                        </Nav.Link>

                        <div className={`menus ${isActive && location.pathname.includes(v_hasChildUrls[1]) ? 'active' : ''} nav-link`} id='menu04'>
                        목표 관리
                            <Nav.Link as={NavLink} className='menuItem' to={`/${roots[6].depth1}/${roots[6].depth2}`}>목표 관리</Nav.Link>
                            <Nav.Link as={NavLink} className='menuItem' to={`/${roots[7].depth1}/${roots[7].depth2}`}>달성률 조회</Nav.Link>
                        </div>
                    </Nav>
                    <div className='loginInfoArea'>{v_loginInfo}</div>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;