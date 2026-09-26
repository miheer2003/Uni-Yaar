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

export const getStoredToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// Request interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
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
        sessionStorage.removeItem('token');
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

// Map API
export const mapApi = {
  getMarkers: (category?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'ALL') params.append('category', category);
    return client.get<ApiResponse<import('../types/map').MapMarker[]>>(`/map/markers?${params.toString()}`);
  },
};

// Faculty API
export const facultyApi = {
  getFacultyList: (search?: string, departmentId?: number, page = 0, size = 20) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (departmentId) params.append('departmentId', departmentId.toString());
    params.append('page', page.toString());
    params.append('size', size.toString());
    return client.get<ApiResponse<{
      content: import('../types/faculty').Faculty[];
      totalElements: number;
      totalPages: number;
      number: number;
    }>>(`/faculty?${params.toString()}`);
  },

  getFaculty: (id: number) =>
    client.get<ApiResponse<import('../types/faculty').Faculty>>(`/faculty/${id}`),

  getTimetable: (id: number) =>
    client.get<ApiResponse<import('../types/faculty').TimetableEntry[]>>(`/faculty/${id}/timetable`),

  getMyProfile: () => client.get<ApiResponse<import('../types/faculty').Faculty>>('/faculty/me'),
  updateMyProfile: (data: { designation: string; subjects?: string; avatarUrl?: string; bio?: string }) =>
    client.put<ApiResponse<import('../types/faculty').Faculty>>('/faculty/me', data),
  createTimetable: (data: { facultyId: number; roomId: number; subject: string; dayOfWeek: string; startTime: string; endTime: string }) =>
    client.post<ApiResponse<import('../types/faculty').TimetableEntry>>('/faculty/timetable', data),
  updateTimetable: (id: number, data: { facultyId: number; roomId: number; subject: string; dayOfWeek: string; startTime: string; endTime: string }) =>
    client.put<ApiResponse<import('../types/faculty').TimetableEntry>>(`/faculty/timetable/${id}`, data),
  deleteTimetable: (id: number) => client.delete<ApiResponse<void>>(`/faculty/timetable/${id}`),
  getMyTimetable: () => client.get<ApiResponse<import('../types/faculty').TimetableEntry[]>>('/faculty/me/timetable'),
  createMyTimetable: (data: { roomId: number; subject: string; dayOfWeek: string; startTime: string; endTime: string }) =>
    client.post<ApiResponse<import('../types/faculty').TimetableEntry>>('/faculty/me/timetable', data),
  deleteMyTimetable: (id: number) => client.delete<ApiResponse<void>>(`/faculty/me/timetable/${id}`),
};

// Food API
export const foodApi = {
  getFacilities: () =>
    client.get<ApiResponse<import('../types/food').FoodFacility[]>>('/food-facilities'),

  getFacility: (id: number) =>
    client.get<ApiResponse<import('../types/food').FoodFacility>>(`/food-facilities/${id}`),

  getMenu: (facilityId: number, date?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    return client.get<ApiResponse<import('../types/food').Menu>>(`/food-facilities/${facilityId}/menu?${params.toString()}`);
  },
};

// Event API
export const eventApi = {
  getAll: (category?: string, status?: string, upcoming?: boolean) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    if (upcoming) params.append('upcoming', 'true');
    return client.get<ApiResponse<import('../types/event').EventItem[]>>(`/events?${params.toString()}`);
  },

  getById: (id: number) =>
    client.get<ApiResponse<import('../types/event').EventItem>>(`/events/${id}`),

  getFeatured: () =>
    client.get<ApiResponse<import('../types/event').EventItem[]>>('/events/featured'),

  register: (id: number) =>
    client.post<ApiResponse<import('../types/event').EventItem>>(`/events/${id}/register`),
  deregister: (id: number) =>
    client.delete<ApiResponse<import('../types/event').EventItem>>(`/events/${id}/register`),
  create: (data: { title: string; description?: string; category: import('../types/event').EventCategory; startsAt: string; endsAt: string; locationName?: string; registrationUrl?: string; capacity?: number; roomId?: number }) =>
    client.post<ApiResponse<import('../types/event').EventItem>>('/events', data),
  update: (id: number, data: { title: string; description?: string; category: import('../types/event').EventCategory; startsAt: string; endsAt: string; locationName?: string; registrationUrl?: string; capacity?: number; roomId?: number }) =>
    client.put<ApiResponse<import('../types/event').EventItem>>(`/events/${id}`, data),
  delete: (id: number) =>
    client.delete<ApiResponse<void>>(`/events/${id}`),
};

// Facility & Issue Reporting API
export const facilityApi = {
  getMaintenanceNotices: (buildingId?: number) => {
    const params = new URLSearchParams();
    if (buildingId) params.append('buildingId', buildingId.toString());
    return client.get<ApiResponse<import('../types/facility').MaintenanceNotice[]>>(
      `/facilities/maintenance?${params.toString()}`
    );
  },

  getNoticeById: (id: number) =>
    client.get<ApiResponse<import('../types/facility').MaintenanceNotice>>(`/facilities/maintenance/${id}`),

  getReports: (category?: string, status?: string, buildingId?: number) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    if (buildingId) params.append('buildingId', buildingId.toString());
    return client.get<ApiResponse<import('../types/facility').IssueReport[]>>(
      `/facilities/reports?${params.toString()}`
    );
  },

  getReportById: (id: number) =>
    client.get<ApiResponse<import('../types/facility').IssueReport>>(`/facilities/reports/${id}`),

  submitReport: (data: import('../types/facility').IssueReportRequest) =>
    client.post<ApiResponse<import('../types/facility').IssueReport>>('/facilities/reports', data),

  upvoteReport: (id: number) =>
    client.post<ApiResponse<import('../types/facility').IssueReport>>(`/facilities/reports/${id}/upvote`),

  updateStatus: (id: number, status: string, staffNotes?: string) =>
    client.patch<ApiResponse<import('../types/facility').IssueReport>>(`/facilities/reports/${id}/status`, {
      status,
      staffNotes,
    }),
};

// Announcement API
export const announcementApi = {
  getAll: (priority?: string, category?: string, audience?: string, departmentId?: number) => {
    const params = new URLSearchParams();
    if (priority) params.append('priority', priority);
    if (category) params.append('category', category);
    if (audience) params.append('audience', audience);
    if (departmentId) params.append('departmentId', departmentId.toString());
    return client.get<ApiResponse<import('../types/announcement').Announcement[]>>(
      `/announcements?${params.toString()}`
    );
  },

  getUrgent: () =>
    client.get<ApiResponse<import('../types/announcement').Announcement[]>>('/announcements/urgent'),

  getById: (id: number) =>
    client.get<ApiResponse<import('../types/announcement').Announcement>>(`/announcements/${id}`),
};

// Search API
export const searchApi = {
  query: (q: string) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    return client.get<ApiResponse<import('../types/search').SearchResponse>>(`/search?${params.toString()}`);
  },
};

// Bookmark API
export const bookmarkApi = {
  getAll: () =>
    client.get<ApiResponse<import('../types/search').Bookmark[]>>('/bookmarks'),

  create: (data: import('../types/search').BookmarkRequest) =>
    client.post<ApiResponse<import('../types/search').Bookmark>>('/bookmarks', data),

  delete: (id: number) =>
    client.delete<ApiResponse<void>>(`/bookmarks/${id}`),
};

// Admin & Staff Console API
export const adminApi = {
  getStats: () =>
    client.get<ApiResponse<import('../types/admin').AdminDashboardMetrics>>('/admin/stats'),

  getUsers: () =>
    client.get<ApiResponse<import('../types/admin').AdminUser[]>>('/admin/users'),

  updateUserRole: (userId: number, role: import('../types/auth').Role) =>
    client.patch<ApiResponse<import('../types/admin').AdminUser>>(`/admin/users/${userId}/role`, { role }),

  resolveMaintenance: (noticeId: number) =>
    client.put<ApiResponse<void>>(`/admin/maintenance/${noticeId}/resolve`),

  createMaintenanceNotice: (data: Partial<import('../types/facility').MaintenanceNotice>) =>
    client.post<ApiResponse<import('../types/facility').MaintenanceNotice>>('/admin/maintenance', data),

  createEvent: (data: Partial<import('../types/event').EventItem>) =>
    client.post<ApiResponse<import('../types/event').EventItem>>('/admin/events', data),

  createAnnouncement: (data: Partial<import('../types/announcement').Announcement>) =>
    client.post<ApiResponse<import('../types/announcement').Announcement>>('/admin/announcements', data),

  deleteAnnouncement: (id: number) =>
    client.delete<ApiResponse<void>>(`/admin/announcements/${id}`),

  deleteEvent: (id: number) =>
    client.delete<ApiResponse<void>>(`/admin/events/${id}`),
};

// Food Staff Management API
export const foodStaffApi = {
  addMenuItem: (facilityId: number, item: { mealType: string; itemName: string; dietaryTag?: string; price?: number; description?: string }, date?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    return client.post<ApiResponse<import('../types/food').Menu>>(`/food-facilities/${facilityId}/menu/items?${params.toString()}`, item);
  },
  deleteMenuItem: (itemId: number) =>
    client.delete<ApiResponse<void>>(`/food-facilities/menu/items/${itemId}`),
};
