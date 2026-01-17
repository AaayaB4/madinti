import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Report } from '../types';
import { Filter, Eye, Search, MoreHorizontal } from 'lucide-react';
import './ReportsList.css';

interface ReportsListProps {
    token: string;
}

const STATUS_LABELS = {
    NEW: 'Nouveau',
    ACKNOWLEDGED: 'Reçu',
    IN_PROGRESS: 'En cours',
    RESOLVED: 'Résolu',
    CLOSED: 'Fermé',
    REJECTED: 'Rejeté',
};

const CATEGORY_LABELS: Record<string, string> = {
    ROAD: 'Voirie & Routes',
    LIGHTING: 'Éclairage Public',
    WASTE: 'Déchets & Propreté',
    WATER: 'Eau & Fuites',
    SANITATION: 'Assainissement',
    PUBLIC_SPACE: 'Espaces Verts',
    SIGNAGE: 'Signalisation',
    OTHER: 'Autre',
};

export default function ReportsList({ token }: ReportsListProps) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadReports();
    }, [statusFilter, categoryFilter]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const filters: any = {};
            if (statusFilter) filters.status = statusFilter;
            if (categoryFilter) filters.category = categoryFilter;

            const data = await apiService.getReports(token, filters);
            setReports(data || []);
        } catch (error) {
            console.error('Failed to load reports:', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status: string) => {
        const classes: Record<string, string> = {
            NEW: 'status-new',
            ACKNOWLEDGED: 'status-acknowledged',
            IN_PROGRESS: 'status-progress',
            RESOLVED: 'status-resolved',
            CLOSED: 'status-closed',
            REJECTED: 'status-rejected',
        };
        return classes[status] || '';
    };

    const filteredReports = reports.filter(r =>
        r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="reports-premium">
            <header className="page-header">
                <div>
                    <h1>Signalements Citoyens</h1>
                    <p>Gérez et suivez les interventions sur le terrain</p>
                </div>
            </header>

            <div className="filters-bar glass">
                <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher par ID ou description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="select-group">
                    <div className="filter-select-wrapper">
                        <Filter size={16} className="select-icon" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Tous les statuts</option>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-select-wrapper">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">Toutes les catégories</option>
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-wrapper glass">
                {loading ? (
                    <div className="loading-spinner">Mise à jour de la liste...</div>
                ) : (
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Signalement</th>
                                <th>Catégorie</th>
                                <th>Status</th>
                                <th>Priorité</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map((report) => (
                                <tr key={report.id}>
                                    <td>
                                        <div className="report-ident">
                                            <span className="report-id">#{report.id.slice(0, 6)}</span>
                                            <span className="report-desc">{report.description?.substring(0, 45)}...</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-tag">
                                            {CATEGORY_LABELS[report.category] || report.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge-premium ${getStatusClass(report.status)}`}>
                                            {STATUS_LABELS[report.status]}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="priority-dots">
                                            {[1, 2, 3, 4, 5].map(p => (
                                                <span key={p} className={`dot ${p <= (report.priority || 1) ? 'active' : ''}`}></span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="date-cell">{new Date(report.createdAt).toLocaleDateString('fr-FR')}</span>
                                    </td>
                                    <td>
                                        <Link to={`/reports/${report.id}`} className="action-btn-circle">
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && filteredReports.length === 0 && (
                    <div className="empty-state-premium">
                        <div className="empty-icon">📂</div>
                        <h3>Aucun résultat</h3>
                        <p>Essayez de modifier vos filtres ou votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
