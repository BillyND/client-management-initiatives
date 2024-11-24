import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// Base URL for API requests
const baseURL = import.meta.env.VITE_API_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL,
  timeout: 10000,

  // Allow sending cookies in cross-origin requests
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Store pending requests
const pendingRequests = new Map();

// Generate request key from config
const getRequestKey = (config: any) => {
  return `${config.method}-${config.url}`;
};

// Cancel previous requests with same key
const cancelPendingRequests = (config: any) => {
  const requestKey = getRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancelToken = pendingRequests.get(requestKey);
    cancelToken.cancel(`Canceled due to duplicate request: ${requestKey}`);
    pendingRequests.delete(requestKey);
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    config.headers["Authorization"] = `Bearer ${accessToken}`;

    // Cancel any pending requests to the same endpoint
    cancelPendingRequests(config);

    // Create new cancel token
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;

    // Store this request's cancel token
    pendingRequests.set(getRequestKey(config), source);

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle API responses and token refresh
apiClient.interceptors.response.use(
  // Success handler - pass through response
  (response) => {
    // Remove completed request from pending
    pendingRequests.delete(getRequestKey(response.config));
    return response;
  },

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
