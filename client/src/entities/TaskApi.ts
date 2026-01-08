import { axiosInstance } from '../shared/lib/axiosInstance';
import type {
  TaskAttributes,
  CreateTaskData,
  UpdateTaskData,
  ApiResponse,
  DeleteTaskResponse,
} from '../types/taskTypes';

export class TaskApi {
  static async getAll(): Promise<ApiResponse<TaskAttributes[]>> {
    const { data } = await axiosInstance.get('/tasks');
    return data;
  }

  static async getById(taskId: number): Promise<ApiResponse<TaskAttributes | null>> {
    const { data } = await axiosInstance.get(`/tasks/${taskId}`);
    return data;
  }

  static async getByUserId(userId: number): Promise<ApiResponse<TaskAttributes[]>> {
    const { data } = await axiosInstance.get(`/tasks/user/${userId}`);
    return data;
  }

  static async create(newTaskData: CreateTaskData): Promise<ApiResponse<TaskAttributes>> {
    const { data } = await axiosInstance.post('/tasks', newTaskData);
    return data;
  }

  static async updateById(
    taskId: number,
    updateData: UpdateTaskData,
  ): Promise<ApiResponse<TaskAttributes>> {
    const { data } = await axiosInstance.put(`/tasks/${taskId}`, updateData);
    return data;
  }

  static async deleteById(taskId: number): Promise<ApiResponse<DeleteTaskResponse>> {
    const { data } = await axiosInstance.delete(`/tasks/${taskId}`);
    return data;
  }
}
