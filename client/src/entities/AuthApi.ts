import { axiosInstance } from '../shared/lib/axiosInstance';
import type {
  SignUpData,
  SignInData,
  AuthResponse,
  ApiResponse,
} from '../types/authTypes';

export class AuthApi {
  static async signUp(userData: SignUpData): Promise<ApiResponse<AuthResponse>> {
    const { data } = await axiosInstance.post('/auth/signUp', userData);
    return data;
  }

  static async signIn(credentials: SignInData): Promise<ApiResponse<AuthResponse>> {
    const { data } = await axiosInstance.post('/auth/signIn', credentials);
    return data;
  }

  static async signOut(): Promise<ApiResponse<null>> {
    const { data } = await axiosInstance.delete('/auth/signOut');
    return data;
  }

  static async refreshTokens(): Promise<ApiResponse<AuthResponse>> {
    const { data } = await axiosInstance.get('/auth/refreshTokens');
    return data;
  }
}
