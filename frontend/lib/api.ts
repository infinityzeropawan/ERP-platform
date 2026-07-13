import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';

// Standardized ApiResponse<T> generic
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Create the Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Interceptor to attach Authorization and Tenant Headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if running on client or server to safely access localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const tenantId = localStorage.getItem('tenant_id');

      if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
      }
      
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === StatusCodes.UNAUTHORIZED) {
      if (typeof window !== 'undefined') {
        // Clear local storage and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('tenant_id');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiFetch = async <T>(
  url: string,
  options: { method?: string; data?: any; params?: any } = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request<ApiResponse<T>>({
      url,
      method: options.method || 'GET',
      data: options.data,
      params: options.params,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<T>>;
    if (axiosError.response?.data) {
      throw axiosError.response.data;
    }
    throw new Error(axiosError.message || 'An unexpected error occurred');
  }
};

export default api;
