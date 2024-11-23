import apiClient from "../utils/apiClient";
import { useAuthStore } from "../store/useAuthStore";

export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );

    useAuthStore.getState().setAuth(response.data.user, {
      refresh: response?.data?.refreshToken,
      access: response?.data?.accessToken,
    });

    return response.data;
  },

  async register(email: string, password: string, name: string) {
    const response = await apiClient.post("/auth/register", {
      email,
      password,
      name,
    });

    return response.data;
  },

  async logout() {
    await apiClient.post("/auth/logout", {}, { withCredentials: true });
    useAuthStore.getState().logout();
  },

  async verifyToken() {
    const response = await apiClient.get("/auth/verify-token");
    return response.data;
  },
};
