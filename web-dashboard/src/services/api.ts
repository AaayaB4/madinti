const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiService = {
    // Auth
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        const json = await response.json();
        return json.data.accessToken;
    },

    // Reports
    getReports: async (token: string, filters?: { status?: string; category?: string }) => {
        const params = new URLSearchParams(filters as any);
        const response = await fetch(`${API_BASE_URL}/reports?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch reports');
        const json = await response.json();
        return json.data;
    },

    getReport: async (token: string, id: string) => {
        const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch report');
        const json = await response.json();
        return json.data;
    },

    updateReportStatus: async (token: string, id: string, status: string, comment?: string) => {
        const response = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, comment }),
        });
        if (!response.ok) throw new Error('Failed to update status');
        const json = await response.json();
        return json.data;
    },

    // Dashboard stats
    getStats: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/stats`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const json = await response.json();
        return json.data;
    },
};
