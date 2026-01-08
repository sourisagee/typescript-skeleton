import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import type { UserAttributes } from '../../types/authTypes';

interface NavBarProps {
  handleSignOut: () => Promise<void>;
  user: UserAttributes | null;
}

export default function NavBar({ handleSignOut, user }: NavBarProps): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const onSignOut = async (): Promise<void> => {
    try {
      await handleSignOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  console.log('Current path:', location.pathname);
  console.log('User:', user);

  // пользователь не авторизован
  if (!user)
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand onClick={() => navigate('/')}>Главная</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate('/signUp')}>Регистрация</Nav.Link>
              <Nav.Link onClick={() => navigate('/signIn')}>Вход</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );

  // мы на главной и пользователь авторизован
  //   if (location.pathname === '/')
  //     return (
  //       <Navbar expand="lg" className="bg-body-tertiary">
  //         <Container>
  //           <Navbar.Brand onClick={() => navigate('/app')}>Главная</Navbar.Brand>
  //           <Navbar.Toggle aria-controls="basic-navbar-nav" />
  //           <Navbar.Collapse id="basic-navbar-nav">
  //             <Nav>
  //               <Nav.Link onClick={onSignOut}>Выход</Nav.Link>
  //             </Nav>
  //           </Navbar.Collapse>
  //         </Container>
  //       </Navbar>
  //     );

  // мы на странице приложения
  // if (location.pathname === '/app')
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>Главная</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link onClick={() => navigate('/allTasks')}>Все задачи</Nav.Link>
            <Nav.Link onClick={() => navigate('/userTasks')}>Мои задачи</Nav.Link>
            <Nav.Link onClick={() => navigate(`/account/${user.id}`)}>
              Мой аккаунт
            </Nav.Link>
            {/* <Nav.Link onClick={() => navigate('/meetup/:meetupId')}>
              Создать митап
            </Nav.Link> */}
            <Nav.Link onClick={onSignOut}>Выход</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
