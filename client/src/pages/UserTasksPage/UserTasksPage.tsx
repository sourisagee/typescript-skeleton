import { useEffect, useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { TaskApi } from '../../entities/TaskApi';
import type { UserAttributes } from '../../types/authTypes';
import type { TaskAttributes } from '../../types/taskTypes';

interface UserTasksPageProps {
  user: UserAttributes | null;
}

interface NewTaskInputs {
  title: string;
  status?: boolean;
}

const INITIAL_TASK_INPUTS: NewTaskInputs = {
  title: '',
  status: false,
};

export default function UserTasksPage({ user }: UserTasksPageProps): React.JSX.Element {
  const [task, setTask] = useState<NewTaskInputs>(INITIAL_TASK_INPUTS);
  const navigate = useNavigate();

  const [userTasks, setUserTasks] = useState<TaskAttributes[]>([]);

  useEffect(() => {
    const getUserTasks = async (): Promise<void> => {
      if (!user) return;

      try {
        const response = await TaskApi.getByUserId(user.id);

        response.data ? setUserTasks(response.data) : setUserTasks([]);
      } catch (error) {
        console.log(error);
      }
    };

    getUserTasks();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!user) return;

    try {
      const response = await TaskApi.create({
        title: task.title.trim(),
        status: false,
        user_id: user.id,
      });
      console.log('Full response:', response);
      console.log('Response data:', response.data);

      if (response.data) {
        const newTaskId = response.data?.id;
        navigate(`/task/${newTaskId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTask((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // авторизованы
  if (user)
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Создание новой задачи</h3>
              </Card.Header>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={task.title}
                      onChange={handleChange}
                      placeholder="Введите название..."
                      required
                    />
                  </Form.Group>

                  {/* <Form.Group className="mb-3">
                    <Form.Label>Адрес</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={meetup.address}
                      onChange={handleChange}
                      placeholder="Введите адрес..."
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Максимальное количество участников</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxParticipants"
                      value={meetup.maxParticipants}
                      onChange={handleChange}
                      min="1"
                      placeholder="Задайте максимальное количество участников..."
                      required
                    />
                  </Form.Group> */}

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={(): void => setTask(INITIAL_TASK_INPUTS)}
                    >
                      Очистить форму
                    </Button>
                    <Button variant="primary" type="submit" disabled={!task.title}>
                      Создать задачу
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mb-5 mt-5">
          <h2>Мои задачи</h2>
        </div>

        {userTasks.length === 0 && (
          <div className="text-center mb-5 mt-5">
            <h5>Пусто... Создайте вашу первую задачу!</h5>
          </div>
        )}

        <Row className="justify-content-center">
          {userTasks.map((task) => {
            return (
              <Col key={task.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title className="fs-6">
                      <h5>Задача №{task.id}</h5>
                    </Card.Title>
                    <Card.Text>
                      <strong>Название:</strong> {task.title} <br />
                    </Card.Text>
                  </Card.Body>

                  <div className="d-flex justify-content-center mt-3 mb-3">
                    <Button
                      onClick={() => {
                        navigate(`/task/${task.id}`);
                      }}
                      variant={'primary'}
                      size="sm"
                    >
                      Подробнее...
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    );

  // если мы не авторизованы
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Добавление новых задач доступно только для авторизованных пользователей. <br />
          <br />
          Для доступа к функционалу приложения войдите или зарегистрируйтесь.
        </p>
      </div>
    </div>
  );

  // return <div>UserTasksPage</div>;
}
