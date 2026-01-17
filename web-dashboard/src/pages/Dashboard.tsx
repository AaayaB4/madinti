import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    AlertCircle, CheckCircle, Clock, FileText, TrendingUp, Users
} from 'lucide-react';
import { apiService } from '../services/api';
import type { DashboardStats } from '../types';
import './Dashboard.css';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280'];

export default function Dashboard({ token }: { token: string }) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiService.getStats(token);
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading || !stats) {
        return <div className="loading-state">Initialisation du Dashboard Premium...</div>;
    }

    // Format data for charts
    const categoryData = Object.entries(stats.reportsByCategory).map(([name, value]) => ({
        name, value
    }));

    const statusData = [
        { name: 'Nouveau', value: stats.newReports, color: '#3B82F6' },
        { name: 'En Cours', value: stats.inProgressReports, color: '#8B5CF6' },
        { name: 'Résolu', value: stats.resolvedReports, color: '#10B981' },
    ];

    return (
        <div className="dashboard-premium">
            <header className="dashboard-header">
                <div>
                    <h1>Vue d'ensemble</h1>
                    <p className="subtitle">Bienvenue sur le portail d'administration Madinti</p>
                </div>
                <div className="header-actions">
                    <span className="last-sync">Dernière mise à jour: {new Date().toLocaleTimeString()}</span>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass shine">
                    <div className="stat-icon bg-blue-soft">
                        <FileText size={24} color="#3B82F6" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Signalements</p>
                        <h3 className="stat-value">{stats.totalReports}</h3>
                        <span className="stat-trend up"><TrendingUp size={12} /> +12%</span>
                    </div>
                </div>

                <div className="stat-card glass shine">
                    <div className="stat-icon bg-yellow-soft">
                        <AlertCircle size={24} color="#F59E0B" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">En Attente</p>
                        <h3 className="stat-value">{stats.newReports}</h3>
                        <span className="stat-status yellow">Action requise</span>
                    </div>
                </div>

                <div className="stat-card glass shine">
                    <div className="stat-icon bg-emerald-soft">
                        <CheckCircle size={24} color="#10B981" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Résolus</p>
                        <h3 className="stat-value">{stats.resolvedReports}</h3>
                        <span className="stat-trend up"><TrendingUp size={12} /> +5%</span>
                    </div>
                </div>

                <div className="stat-card glass shine">
                    <div className="stat-icon bg-purple-soft">
                        <Clock size={24} color="#8B5CF6" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Délai Moyen</p>
                        <h3 className="stat-value">{stats.avgResolutionTime}h</h3>
                        <span className="stat-status purple">Objectif: 24h</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-container glass">
                    <div className="chart-header">
                        <h3>Signalements par Catégorie</h3>
                        <p>Répartition sectorielle des demandes</p>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container glass">
                    <div className="chart-header">
                        <h3>État des Tâches</h3>
                        <p>Cycle de vie des signalements</p>
                    </div>
                    <div className="chart-body pie-chart-flex">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-legend">
                            {statusData.map((item, index) => (
                                <div key={index} className="legend-item">
                                    <span className="dot" style={{ backgroundColor: item.color }}></span>
                                    <span className="label text-sm font-medium">{item.name}</span>
                                    <span className="value text-sm text-gray-400">({item.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
