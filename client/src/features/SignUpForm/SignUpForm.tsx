import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { axiosInstance, setAccessToken } from '../../shared/lib/axiosInstance';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import type { ApiResponse, AuthResponse, UserAttributes } from '../../types/authTypes';

interface SignUpFormProps {
  setUser: (user: UserAttributes | null) => void;
}

interface SignUpInputs {
  username: string;
  email: string;
  password: string;
}

const INITIAL_INPUTS_DATA: SignUpInputs = {
  username: '',
  email: '',
  password: '',
};

export default function SignUpForm({ setUser }: SignUpFormProps): React.JSX.Element {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<SignUpInputs>(INITIAL_INPUTS_DATA);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputs((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    console.log('Submit!');

    try {
      const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
        '/auth/signUp',
        inputs,
      );
      console.log(response);

      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        setUser(response.data.data.user);
        setAccessToken(response.data.data.accessToken);

        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container className="min-vh-100 d-flex align-items-center justify-content-center">
        <Row className="w-100">
          <Col md={6} lg={4} className="mx-auto">
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4">
                <Form onSubmit={handleSignUp}>
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Создай аккаунт</h2>
                    <p className="text-muted">Присоединяйся к нам!</p>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Имя</Form.Label>
                    <Form.Control
                      onChange={handleChange}
                      name="username"
                      type="text"
                      placeholder="Введите имя пользователя"
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Почта</Form.Label>
                    <Form.Control
                      onChange={handleChange}
                      name="email"
                      type="email"
                      placeholder="Введите адрес электронной почты"
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Пароль</Form.Label>
                    <Form.Control
                      onChange={handleChange}
                      name="password"
                      type="password"
                      placeholder="Введите пароль"
                      className="py-2"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-semibold"
                    size="lg"
                  >
                    Зарегистрироваться
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
