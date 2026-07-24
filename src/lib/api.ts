import axios from 'axios';

const getBaseApiUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
  const clean = raw.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_URL = getBaseApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error as Error);
  },
);

// ─── Types ──────────────────────────────────────────────────────────────────

export type ApplicationStatus = 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected';

export type InternshipTrack =
  | 'Frontend_Development'
  | 'Backend_Development'
  | 'Mobile_Development'
  | 'UI_UX_Design'
  | 'Data_Analytics';

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  track: InternshipTrack;
  status: ApplicationStatus;
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  data: {
    totalApplicants: number;
    byStatus: Record<ApplicationStatus, number>;
    byTrack: Record<InternshipTrack, number>;
    recentApplicants: Partial<Applicant>[];
  };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ data: { accessToken: string; admin: { id: string; email: string; name: string } } }>('/auth/login', { email, password }),

  me: () =>
    api.get<{ data: { id: string; email: string; name: string } }>('/auth/me'),
};

// ─── Applicants ──────────────────────────────────────────────────────────────

export const applicantsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Applicant>>('/applicants', { params }),

  get: (id: string) =>
    api.get<{ data: Applicant }>(`/applicants/${id}`),

  create: (data: Partial<Applicant>) =>
    api.post<{ data: Applicant }>('/applicants', data),

  update: (id: string, data: Partial<Applicant>) =>
    api.patch<{ data: Applicant }>(`/applicants/${id}`, data),

  delete: (id: string) =>
    api.delete<{ data: Applicant }>(`/applicants/${id}`),

  updateStatus: (id: string, status: ApplicationStatus) =>
    api.patch<{ data: Applicant }>(`/applicants/${id}/status`, { status }),

  updateNotes: (id: string, notes: string) =>
    api.patch<{ data: Applicant }>(`/applicants/${id}/notes`, { notes }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>('/dashboard/summary'),
};
