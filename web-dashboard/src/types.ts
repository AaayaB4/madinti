export interface Report {
    id: string;
    userId: string;
    category: string;
    description: string;
    locationLat: number;
    locationLng: number;
    address?: string;
    status: 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
    priority: 1 | 2 | 3 | 4;
    photoUrls: string[];
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    assignedTo?: string;
    department?: string;
    upvoteCount: number;
}

export interface DashboardStats {
    totalReports: number;
    newReports: number;
    inProgressReports: number;
    resolvedReports: number;
    avgResolutionTime: number;
    reportsByCategory: Record<string, number>;
}

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'field_worker';
    fullName: string;
}
