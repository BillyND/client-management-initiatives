import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// Base URL for API requests
const baseURL = import.meta.env.VITE_API_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL,
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle API responses and token refresh
apiClient.interceptors.response.use(
  // Success handler - pass through response
  (response) => response,

  // Error handler with token refresh logic
  async (error) => {
    const { config, response } = error;

    // Only attempt token refresh on 401 unauthorized errors
    if (!config || response?.status !== 401) {
      return Promise.reject(error);
    }

    const authStore = useAuthStore.getState();
    const refreshToken = authStore.refreshToken;
    const email = authStore.user?.email;

    // If no refresh token available, reject immediately
    if (!refreshToken || !email) {
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh the access token
      const { data } = await apiClient.post(
        "/auth/refresh-token",
        { refreshToken, email },
        { withCredentials: true }
      );

      // Validate refresh response
      if (!data?.accessToken || !data?.refreshToken) {
        throw new Error("Invalid refresh token response");
      }

      // Update request authorization header
      config.headers["Authorization"] = `Bearer ${data.accessToken}`;

      // Update auth store with new tokens
      authStore.setAuth(data.user, {
        access: data.accessToken,
        refresh: data.refreshToken,
      });

      // Retry original request with new token
      return apiClient.request(config);
    } catch (error: any) {
      // On refresh failure, logout user and reject
      authStore.logout();
      return Promise.reject(error);
    }
  }
);

export default apiClient;
