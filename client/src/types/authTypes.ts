export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  role?: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
}

export interface DeleteUserResponse {
  deletedCount: number;
}

export interface AuthResponse {
  user: UserAttributes;
  accessToken: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  error: unknown;
}
