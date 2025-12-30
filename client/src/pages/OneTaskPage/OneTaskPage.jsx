import { useEffect, useState } from 'react';
import { TaskApi } from '../../entities/TaskApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Col, Container, Row, Button, Form, Modal } from 'react-bootstrap';

export default function OneTaskPage({ user }) {
  const { taskId } = useParams();
  const [formData, setFormData] = useState({ title: '' });
  const [currentTask, setCurrentTask] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentTask = async () => {
      const response = await TaskApi.getById(taskId);
      const taskData = response.data;
      setCurrentTask(taskData);
      setFormData({ title: taskData.title });
    };

    getCurrentTask();
  }, [taskId]);

  const handleUpdate = async () => {
    try {
      await TaskApi.updateById(taskId, formData);

      setEditMode(false);

      const response = await TaskApi.getById(taskId);
      setCurrentTask(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await TaskApi.deleteById(taskId);

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
                      value={formData.title}
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
