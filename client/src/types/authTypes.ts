export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
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
