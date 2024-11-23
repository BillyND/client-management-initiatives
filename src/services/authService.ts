import apiClient from "../lib/apiClient";
import { User } from "./types";

export const authService = {
  async login(email: string, password: string) {
    return apiClient.post("/auth/login", { email, password });
  },

  async register(email: string, password: string, name: string) {
    return apiClient.post<User>("/auth/register", { email, password, name });
  },

  async logout() {
    return apiClient.post("/auth/logout");
  },

  async getCurrentUser() {
    return apiClient.get<User>("/auth/me");
  },
};
