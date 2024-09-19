// env.d.ts
/// <reference types="vite/client" />
// axiosConfig.ts
import { notification } from 'antd';
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { callRefreshToken } from '../services/clientApi';
// Lấy URL cơ sở từ biến môi trường

const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleRefreshToken = async () => {
  // Xóa accessToken cũ
  localStorage.removeItem('accessToken');

  try {
    const res = await callRefreshToken();
    const newAccessToken = res.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    localStorage.removeItem('accessToken');
    notification.error({
      message: 'Login version has expired. Please log in again.',
      description: 'Please log in again.',
      duration: 5,
      showProgress: true,
    });
    window.location.href = '/login';
    throw error;
  }
};

// Mở rộng kiểu InternalAxiosRequestConfig để thêm thuộc tính _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// Thêm interceptor cho yêu cầu
instance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho phản hồi
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= 2) {
        try {
          // Remove old access token before attempting to refresh
          localStorage.removeItem('accessToken');
          const newAccessToken = await handleRefreshToken();
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed', refreshError);
          return Promise.reject(refreshError);
        }
      } else {
        // Handle when refresh token fails after 3 attempts
        console.error('Refresh token failed after 2 attempts');
        window.location.href = '/login';
        notification.error({
          message: 'Login session has expired. Please log in again.',
          description: 'Please log in again.',
          duration: 5,
        });
        localStorage.removeItem('accessToken');
        return error.response || Promise.reject(error); // Return the response even in case of a failed retry
      }
    }

    return error.response || Promise.reject(error); // Return the error for other cases
  }
);

export default instance;
