import apiClient from "../utils/apiClient";
import { EditProfileFormData, User } from "./types";

export const userService = {
  async updateProfile(data: EditProfileFormData): Promise<User> {
    const response = await apiClient.put("/users/profile", data);
    return response.data;
  },
};
