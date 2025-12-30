import { axiosInstance } from '../shared/lib/axiosInstance';

export class TaskApi {
  static async getAll() {
    const { data } = await axiosInstance.get('/tasks');
    return data;
  }

  static async getById(taskId) {
    const { data } = await axiosInstance.get(`/tasks/${taskId}`);
    return data;
  }

  static async getByUserId(userId) {
    const { data } = await axiosInstance.get(`/tasks/user/${userId}`);
    return data;
  }

  static async create(newTaskData) {
    const { data } = await axiosInstance.post('/tasks', newTaskData);
    return data;
  }

  static async updateById(taskId, updateData) {
    const { data } = await axiosInstance.put(`/tasks/${taskId}`, updateData);
    return data;
  }

  static async deleteById(taskId) {
    const { data } = await axiosInstance.delete(`/tasks/${taskId}`);
    return data;
  }
}
