import apiClient from "../utils/apiClient";
import { User } from "./types";

export const userService = {
  async getUsers(params: any): Promise<{ data: User[]; total: number }> {
    try {
      const response = await apiClient.get(
        "/users?" + new URLSearchParams(params)
      );
      if (response.status !== 200) throw new Error("Failed to fetch users");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch users" + error);
    }
  },

  async getUserByEmail(email: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${email}`);
      if (response.status !== 200) throw new Error("Failed to fetch user");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user details" + error);
    }
  },

  async updateUser(email: string, data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put(`/users/${email}`, data);
      if (response.status !== 200) throw new Error("Failed to update user");
      return response.data;
    } catch (error) {
      throw new Error("Failed to update user" + error);
    }
  },
};
