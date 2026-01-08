import { useEffect, useState } from 'react';
import { TaskApi } from '../../entities/TaskApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Col, Container, Row, Button, Form, Modal } from 'react-bootstrap';
import type { UserAttributes } from '../../types/authTypes';
import type { TaskAttributes, UpdateTaskData } from '../../types/taskTypes';

interface OneTaskPageProps {
  user: UserAttributes | null;
}

const INITIAL_FORM_DATA: UpdateTaskData = {
  title: '',
};

export default function OneTaskPage({ user }: OneTaskPageProps): React.JSX.Element {
  const { taskId } = useParams();
  const numTaskId = Number(taskId);

  const [formData, setFormData] = useState<UpdateTaskData>(INITIAL_FORM_DATA);
  const [currentTask, setCurrentTask] = useState<TaskAttributes | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentTask = async (): Promise<void> => {
      if (!numTaskId || isNaN(numTaskId)) return;

      try {
        const response = await TaskApi.getById(numTaskId);

        if (response.data) {
          setCurrentTask(response.data);
          setFormData({ title: response.data.title });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCurrentTask();
  }, [numTaskId]);

  const handleUpdate = async (): Promise<void> => {
    if (!currentTask) return;

    try {
      await TaskApi.updateById(numTaskId, formData);

      setEditMode(false);

      const response = await TaskApi.getById(numTaskId);
      setCurrentTask(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await TaskApi.deleteById(numTaskId);

      setShowDeleteModal(false);
      navigate('/userTasks');
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentTask) return <div>Поиск задачи...</div>;

  const isOwner = user && currentTask.user_id === user.id;
  const isAdmin = user && user.role === 'admin';
  const canModify = isOwner || isAdmin;

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Card className="h-100">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Текущая задача</h3>
              </Card.Header>

              <Card.Body>
                <Card.Title className="fs-6">
                  <h5>Задача №{currentTask.id}</h5>
                </Card.Title>

                {editMode ? (
                  <Form.Group className="mb-3">
                    <Form.Label>Название:</Form.Label>
                    <Form.Control
                      name="title"
                      value={formData.title || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </Form.Group>
                ) : (
                  <Card.Text>
                    <strong>Название:</strong> {currentTask.title} <br />
                  </Card.Text>
                )}
              </Card.Body>

              {canModify && (
                <Card.Footer className="d-flex justify-content-center">
                  {editMode ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleUpdate}
                        className="me-2"
                      >
                        Сохранить
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditMode(false)}
                      >
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setEditMode(true)}
                        className="me-2"
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Удалить
                      </Button>
                    </>
                  )}
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>

        {canModify && (
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Подтверждение удаления</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Вы уверены, что хотите удалить задачу "{currentTask.title}"?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Отмена
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Удалить
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </>
  );
}
