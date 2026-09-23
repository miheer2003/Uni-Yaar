import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Response type matching backend ApiResponse<T>
export interface ApiResponse<T> {
  timestamp: string;
  success: boolean;
  status: number;
  message: string;
  data: T;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

// Create axios instance with default config
const client: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('Access denied');
      } else if (status === 404) {
        console.error('Resource not found');
      } else if (status >= 500) {
        console.error('Server error occurred');
      }
    } else if (error.request) {
      console.error('Network error - unable to reach server');
    }
    
    return Promise.reject(error);
  }
);

export default client;

// Health check API
export const healthApi = {
  check: () => client.get<ApiResponse<{
    application: string;
    status: string;
    version: string;
    checkedAt: string;
  }>>('/health'),
};

// Auth API
export const authApi = {
  login: (credentials: LoginRequest) => 
    client.post<ApiResponse<AuthResponse>>('/auth/login', credentials),
  
  register: (data: RegisterRequest) => 
    client.post<ApiResponse<AuthResponse>>('/auth/register', data),
  
  getProfile: () => 
    client.get<ApiResponse<User>>('/auth/profile'),
};

// Campus API
export const campusApi = {
  getBuildings: (search?: string, page = 0, size = 20) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('size', size.toString());
    return client.get<ApiResponse<{
      content: import('../types/campus').Building[];
      totalElements: number;
      totalPages: number;
      number: number;
    }>>(`/buildings?${params.toString()}`);
  },

  getBuilding: (id: number) =>
    client.get<ApiResponse<import('../types/campus').Building>>(`/buildings/${id}`),

  getFloors: (buildingId: number) =>
    client.get<ApiResponse<import('../types/campus').Floor[]>>(`/buildings/${buildingId}/floors`),

  getRooms: (floorId: number) =>
    client.get<ApiResponse<import('../types/campus').Room[]>>(`/buildings/floors/${floorId}/rooms`),

  getRoom: (roomId: number) =>
    client.get<ApiResponse<import('../types/campus').Room>>(`/buildings/rooms/${roomId}`),
};

