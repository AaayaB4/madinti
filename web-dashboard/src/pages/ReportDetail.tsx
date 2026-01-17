import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Report } from '../types';
import { ArrowLeft, MapPin, Calendar, ThumbsUp, User, Tag, Clock, Send } from 'lucide-react';
import './ReportDetail.css';

interface ReportDetailProps {
    token: string;
}

const STATUS_OPTIONS = [
    { value: 'NEW', label: 'Nouveau', color: '#2563eb' },
    { value: 'ACKNOWLEDGED', label: 'Reçu', color: '#d97706' },
    { value: 'IN_PROGRESS', label: 'En cours', color: '#7c3aed' },
    { value: 'RESOLVED', label: 'Résolu', color: '#059669' },
    { value: 'CLOSED', label: 'Fermé', color: '#64748b' },
    { value: 'REJECTED', label: 'Rejeté', color: '#dc2626' },
];

export default function ReportDetail({ token }: ReportDetailProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        loadReport();
    }, [id]);

    const loadReport = async () => {
        try {
            const data = await apiService.getReport(token, id!);
            setReport(data);
            setNewStatus(data.status);
        } catch (error) {
            console.error('Failed to load report:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!report || newStatus === report.status) return;

        setUpdating(true);
        try {
            await apiService.updateReportStatus(token, report.id, newStatus, comment);
            await loadReport();
            setComment('');
        } catch (error) {
            alert('Erreur lors de la mise à jour');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="loading-premium">Préparation du dossier...</div>;
    if (!report) return <div className="error-premium">Signalement introuvable</div>;

    return (
        <div className="report-detail-premium">
            <div className="detail-header">
                <button onClick={() => navigate('/reports')} className="back-btn-premium glass">
                    <ArrowLeft size={18} />
                    <span>Retour</span>
                </button>
                <div className="id-badge glass">ID: {report.id.toUpperCase()}</div>
            </div>

            <div className="detail-grid-premium">
                {/* Main Content Area */}
                <div className="main-col">
                    <div className="card-premium glass">
                        <div className="card-header">
                            <Tag size={20} className="icon-emerald" />
                            <h2>{report.category}</h2>
                        </div>
                        <div className="description-box-premium">
                            <p>{report.description || 'Aucune description fournie.'}</p>
                        </div>

                        {report.photoUrls && report.photoUrls.length > 0 && (
                            <div className="gallery-premium">
                                {report.photoUrls.map((url, index) => (
                                    <div key={index} className="photo-wrapper">
                                        <img src={url} alt={`Fait ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card-premium glass mt-24">
                        <div className="card-header">
                            <MapPin size={20} className="icon-emerald" />
                            <h2>Localisation</h2>
                        </div>
                        <div className="location-details">
                            <p className="address">{report.address || 'Adresse non spécifiée'}</p>
                            <div className="coordinates glass">
                                <span>LAT: {report.locationLat.toFixed(5)}</span>
                                <span className="sep">|</span>
                                <span>LNG: {report.locationLng.toFixed(5)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="side-col">
                    <div className="card-premium glass status-card">
                        <div className="card-header">
                            <Clock size={20} className="icon-emerald" />
                            <h2>Action Requise</h2>
                        </div>

                        <div className="current-status-display">
                            <span className="label">Statut Actuel</span>
                            <div className={`status-pill ${report.status.toLowerCase()}`}>
                                {report.status}
                            </div>
                        </div>

                        <div className="status-form-premium">
                            <label>Changer le statut</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="premium-select"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            <label>Notification au citoyen</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Ex: L'équipe technique est en route..."
                                rows={4}
                                className="premium-textarea"
                            />

                            <button
                                onClick={handleUpdateStatus}
                                disabled={updating || newStatus === report.status}
                                className="submit-btn-premium"
                            >
                                {updating ? 'Traitement...' : 'Approuver & Notifier'}
                                {!updating && <Send size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="card-premium glass metadata-card">
                        <div className="meta-item">
                            <div className="meta-icon"><Calendar size={18} /></div>
                            <div className="meta-info">
                                <span className="label">Signalé le</span>
                                <span className="value">{new Date(report.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}</span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <div className="meta-icon"><ThumbsUp size={18} /></div>
                            <div className="meta-info">
                                <span className="label">Engagement</span>
                                <span className="value">{report.upvoteCount} votes citoyens</span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <div className="meta-icon"><User size={18} /></div>
                            <div className="meta-info">
                                <span className="label">Auteur</span>
                                <span className="value">Utilisateur #{report.userId.slice(0, 5)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
