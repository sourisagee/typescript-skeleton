import { useEffect, useState } from 'react';
import { TaskApi } from '../../entities/TaskApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';

export default function UserAccountPage({ user, setUser }) {
  const navigate = useNavigate();

  if (!user)
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Пользователь не найден</Card.Title>
                <Card.Text>Войдите в систему, чтобы просмотреть свой аккаунт</Card.Text>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Войти
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col key={user.id} xs={12} sm={10} md={8} lg={6} className="mb-4">
            <Card className="h-100">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Мой аккаунт</h3>
              </Card.Header>

              <Card.Body>
                <Card.Title className="fs-6">
                  <h5>ID пользователя: {user.id}</h5>
                </Card.Title>
                <Card.Text>
                  <strong>Имя пользователя:</strong> {user.username} <br />
                  <strong>Email пользователя: </strong> {user.email} <br />
                  <strong>Роль пользователя: </strong>{' '}
                  {user.role === 'admin' ? 'Администратор' : 'Обычный'} <br />
                </Card.Text>
              </Card.Body>
              <div className="d-flex justify-content-center mt-3 mb-3"></div>
              <div className="d-flex justify-content-center mt-3 mb-3"></div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );

  // return <div>UserAccountPage</div>;
}
