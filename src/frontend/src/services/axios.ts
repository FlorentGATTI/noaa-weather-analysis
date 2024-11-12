// src/services/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { authService } from "./auth.service";
import type { AuthResponse } from '../features/auth/types';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshAccessToken = async (): Promise<AuthResponse> => {
  const refreshToken = authService.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axiosInstance.post<AuthResponse>('/auth/refresh', {
    refresh_token: refreshToken
  });

  return response.data;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          if (originalRequest.headers && typeof token === 'string') {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshAccessToken();
        authService.setTokens(response.access_token, response.refresh_token);
        processQueue(null, response.access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        authService.clearTokens();
        // Au lieu d'utiliser navigateToLogin, on laisse AuthProvider gérer la redirection
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// src/services/auth.service.ts
import { jwtDecode } from "jwt-decode";

export class AuthService {
  private readonly ACCESS_TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();
