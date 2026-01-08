import { axiosInstance } from '../shared/lib/axiosInstance';
import type {
  UserAttributes,
  ApiResponse,
  AuthResponse,
  UpdateProfileData,
  DeleteUserResponse,
} from '../types/authTypes';

export class UserApi {
  static async getAll(): Promise<ApiResponse<UserAttributes[]>> {
    const { data } = await axiosInstance.get('/users');
    return data;
  }

  static async getById(userId: number): Promise<ApiResponse<UserAttributes | null>> {
    const { data } = await axiosInstance.get(`/users/${userId}`);
    return data;
  }

  static async updateProfile(
    userId: number,
    updateData: UpdateProfileData,
  ): Promise<ApiResponse<AuthResponse>> {
    const { data } = await axiosInstance.put(`/users/${userId}`, updateData);
    return data;
  } 

  static async deleteById(userId: number): Promise<ApiResponse<DeleteUserResponse>> {
    const { data } = await axiosInstance.delete(`/users/${userId}`);
    return data;
  }
}
