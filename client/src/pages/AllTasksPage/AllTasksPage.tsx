import { useEffect } from 'react';
import { TaskApi } from '../../entities/TaskApi';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import type { UserAttributes } from '../../types/authTypes';
import type { TaskAttributes } from '../../types/taskTypes';

interface AllTasksPageProps {
  user: UserAttributes | null;
  allTasks: TaskAttributes[];
  setAllTasks: (allTasks: TaskAttributes[]) => void;
}

export default function AllTasksPage({
  user,
  allTasks,
  setAllTasks,
}: AllTasksPageProps): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const getAllTasks = async (): Promise<void> => {
      try {
        const response = await TaskApi.getAll();
        console.log(response);
        console.log(response.data);

        response.data ? setAllTasks(response.data) : setAllTasks([]);
        // setAllTasks(response.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    getAllTasks();
  }, [setAllTasks]);

  const handleClick = (taskId: number): void => {
    navigate(`/task/${taskId}`);
  };

  // return <div>AllTasksPage</div>;
  return (
    <>
      <Container className="mt-4">
        <div className="text-center mb-5">
          <h2>Все задачи</h2>
        </div>

        {!user && (
          <Alert variant="primary">Войдите в аккаунт, чтобы увидеть все задачи</Alert>
        )}
        {user && allTasks.length === 0 && (
          <Alert variant="primary">Нет доступных задач</Alert>
        )}

        {user && (
          <Row className="justify-content-center">
            {allTasks.map((task) => {
              return (
                <Col key={task.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title className="fs-6">
                        <h5>Задача №{task.id}</h5>
                      </Card.Title>
                      <Card.Text>
                        {/* <strong>Описание: </strong> <br />
                        {meetup.description.length > 50
                          ? `${meetup.description.substring(0, 50)}...`
                          : meetup.description}
                        <br /> */}
                        <strong>Название:</strong> {task.title} <br />
                        {/* <strong>Участники:</strong> {meetup.registeredCount}
                        <br />
                        {owner && (
                          <span className="text-muted">
                            <small>Ваш митап</small>
                          </span>
                        )}
                        {registered && !owner && (
                          <span className="text-success">
                            <small>✓ Вы записаны</small>
                          </span>
                        )} */}
                      </Card.Text>
                    </Card.Body>
                    {/* <div className="d-flex justify-content-center mt-3 mb-3">
                      <Button
                        onClick={() => handleRegistrationChange(meetup.id)}
                        disabled={
                          owner ||
                          (!registered &&
                            meetup.registeredCount >= meetup.maxParticipants)
                        }
                        variant={
                          owner ? 'secondary' : registered ? 'outline-danger' : 'primary'
                        }
                        size="sm"
                      >
                        {owner ? 'Ваш митап' : registered ? 'Отменить запись' : 'Я пойду'}
                      </Button>
                    </div> */}
                    <div className="d-flex justify-content-center mt-3 mb-3">
                      <Button
                        onClick={() => handleClick(task.id)}
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
        )}
      </Container>
    </>
  );
}
