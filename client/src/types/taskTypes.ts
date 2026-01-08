export interface TaskAttributes {
  id: number;
  title: string;
  status: boolean;
  user_id: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskData {
  title: string;
  status?: boolean;
  user_id: number;
}

export interface UpdateTaskData {
  title?: string;
  status?: boolean;
}

export interface DeleteTaskResponse {
  deletedCount: number;
}

export interface TaskResponse {
  task: TaskAttributes;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  error: unknown;
}
