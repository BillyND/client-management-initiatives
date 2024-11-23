import axios from "axios";
import { sleep } from "./time";
import { User } from "../services/types";

// Constants
const LOCAL_STORAGE_USER_KEY = "KEY_INFO_USER";
const NO_RETRY_HEADER = "x-no-retry";
const LOCAL_DOMAINS = ["127.0.0.1", "localhost", "billynd.site"];
const DEFAULT_LOCAL_DELAY = 1000;

// Base URL for API requests
const baseURL = import.meta.env.VITE_BACKEND_URL;
const isLocalApi = LOCAL_DOMAINS.some((domain) => baseURL?.includes(domain));

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL,
  timeout: 10000, // Add reasonable timeout
});

// Helper functions
const handleDelayApiLocal = async () => {
  if (isLocalApi) await sleep(DEFAULT_LOCAL_DELAY);
};

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY) || "{}");
  } catch {
    return {};
  }
};

const setUserInStorage = (userData: User) => {
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
};

const removeUserFromStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
};

const handleRefreshToken = async () => {
  const { refreshToken } = getUserFromStorage();
  if (!refreshToken) return null;

  const response = await apiClient.post("/auth/refresh", {
    refreshLocal: refreshToken,
  });
  return response?.data;
};

const setAccessToken = () => {
  const { accessToken } = getUserFromStorage();
  if (accessToken) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    setAccessToken();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  async (response) => {
    await handleDelayApiLocal();

    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Handle token refresh
    if (
      config &&
      response?.status === 401 &&
      !config.headers[NO_RETRY_HEADER]
    ) {
      const data = await handleRefreshToken();

      console.log("data", data);

      if (data?.accessToken && data?.refreshToken) {
        config.headers[NO_RETRY_HEADER] = "true";
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        console.log("data", data);

        // Update stored tokens
        const userData = getUserFromStorage();
        setUserInStorage({
          ...userData,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        return apiClient.request(config);
      }
    }

    // Handle refresh token failure
    if (config?.url === "/auth/refresh" && response?.status === 400) {
      removeUserFromStorage();
    }

    await handleDelayApiLocal();
    return response?.data ?? Promise.reject(error);
  }
);

export default apiClient;
