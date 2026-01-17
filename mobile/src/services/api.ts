import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Store tokens
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setAuthTokens = (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
};

export const clearAuthTokens = () => {
    accessToken = null;
    refreshToken = null;
    delete api.defaults.headers.common['Authorization'];
};

export const getAccessToken = () => accessToken;

// Auth interfaces
export interface RegisterData {
    cinNumber: string;
    phoneNumber: string;
    fullName: string;
}

export interface LoginData {
    cinNumber: string;
}

export interface VerifyOTPData {
    userId: string;
    otpCode: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        phoneNumber: string;
        fullName: string | null;
        role: string;
    };
}

export interface Report {
    id: string;
    category: string;
    description: string;
    locationLat: number;
    locationLng: number;
    address?: string;
    status: string;
    photoUrls: string[];
    createdAt: string;
    upvoteCount: number;
    userId: string;
}

export interface CreateReportData {
    category: string;
    description: string;
    locationLat: number;
    locationLng: number;
    address?: string;
    photoUrls?: string[];
}

export const apiService = {
    // Auth endpoints
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    verifyOTP: async (data: VerifyOTPData): Promise<AuthResponse> => {
        const response = await api.post('/auth/verify-otp', data);
        const { accessToken: access, refreshToken: refresh, user } = response.data.data;
        setAuthTokens(access, refresh);
        return { accessToken: access, refreshToken: refresh, user };
    },

    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    resendOTP: async (userId: string) => {
        const response = await api.post('/auth/resend-otp', { userId });
        return response.data;
    },

    // Health check
    healthCheck: async () => {
        const response = await api.get('/health');
        return response.data;
    },

    // Get all reports
    getReports: async (): Promise<Report[]> => {
        const response = await api.get('/reports');
        return response.data.data;
    },

    // Get single report
    getReport: async (id: string): Promise<Report> => {
        const response = await api.get(`/reports/${id}`);
        return response.data.data;
    },

    // Create report (requires auth)
    createReport: async (data: CreateReportData): Promise<Report> => {
        const response = await api.post('/reports', data);
        return response.data.data;
    },

    // Upload photo (placeholder)
    uploadPhoto: async (uri: string): Promise<string> => {
        // TODO: Implement file upload to MinIO
        return uri;
    },
};

export default api;
