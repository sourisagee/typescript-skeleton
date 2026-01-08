import { useState, type ChangeEvent, type FormEvent } from 'react';
import { axiosInstance, setAccessToken } from '../../shared/lib/axiosInstance';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import type { ApiResponse, AuthResponse, UserAttributes } from '../../types/authTypes';

interface SignInFormProps {
  setUser: (user: UserAttributes | null) => void;
}

interface SignInInputs {
  email: string;
  password: string;
}

const INITIAL_INPUTS_DATA: SignInInputs = {
  email: '',
  password: '',
};

export default function SignInForm({ setUser }: SignInFormProps): React.JSX.Element {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<SignInInputs>(INITIAL_INPUTS_DATA);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputs((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      console.log('Sign in submit!');

      const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
        '/auth/signIn',
        inputs,
      );
      console.log('Успешный вход', response.data);

      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('accessToken', response.data.data.accessToken);

        setUser(response.data.data.user);
        setAccessToken(response.data.data.accessToken);

        navigate('/');
      }
    } catch (error) {
      console.log(error);
      alert('Ошибка при входе');
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <Form onSubmit={handleSignIn}>
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
                  Войти
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
