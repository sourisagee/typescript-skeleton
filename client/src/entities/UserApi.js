import { axiosInstance } from '../shared/lib/axiosInstance';

export class UserApi {
  static async getAll() {
    const { data } = await axiosInstance.get('/users');
    return data;
  }

  static async getById(userId) {
    const { data } = await axiosInstance.get(`/users/${userId}`);
    return data;
  }

  static async updateProfile(userId, updateData) {
    const { data } = await axiosInstance.put(`/users/${userId}`, updateData);
    return data;
  }

  static async deleteById(userId) {
    const { data } = await axiosInstance.delete(`/users/${userId}`);
    return data;
  }
}
