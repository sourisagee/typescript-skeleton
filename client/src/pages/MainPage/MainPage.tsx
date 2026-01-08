import { Outlet, useLocation } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

export default function MainPage(): React.JSX.Element {
  const location = useLocation();
  const isMainPage: boolean = location.pathname === '/';

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="container mt-4">
        <Outlet />
        {isMainPage && (
          <div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <strong>Как мне начать пользоваться приложением?</strong>
                </Accordion.Header>
                <Accordion.Body>
                  Пожалуйста, зарегистрируйтесь или авторизуйтесь для доступа к
                  приложению.
                </Accordion.Body>
              </Accordion.Item>

              {/* <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <strong>header</strong>
                </Accordion.Header>
                <Accordion.Body>
                  text
                </Accordion.Body>
              </Accordion.Item> */}
            </Accordion>
          </div>
        )}
      </main>
    </div>
  );
}
