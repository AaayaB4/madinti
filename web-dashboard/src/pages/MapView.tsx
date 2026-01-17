import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Report } from '../types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
    token: string;
}

const CATEGORY_ICONS: Record<string, string> = {
    ROAD: '🛣️',
    LIGHTING: '💡',
    WASTE: '🧹',
    WATER: '💧',
    SANITATION: '🚽',
    PUBLIC_SPACE: '🌳',
    SIGNAGE: '🪧',
    OTHER: '📍',
};

// Helper component to fix Leaflet size issues
function MapInvalidator() {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
}

export default function MapView({ token }: MapViewProps) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await apiService.getReports(token);
            setReports(data || []);
        } catch (error) {
            console.error('Failed to load reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            NEW: '#3B82F6',
            ACKNOWLEDGED: '#F59E0B',
            IN_PROGRESS: '#8B5CF6',
            RESOLVED: '#10B981',
            CLOSED: '#64748b',
            REJECTED: '#EF4444',
        };
        return colors[status] || '#6B7280';
    };

    return (
        <div className="map-view-premium">
            <header className="page-header">
                <div className="header-content">
                    <h1>Cartographie des Signalements</h1>
                    <p>Vue d'ensemble géographique de la ville en temps réel</p>
                </div>
                <div className="map-stats glass">
                    <div className="stat-pill">
                        <span className="count">{reports.length}</span>
                        <span className="label">Marqueurs</span>
                    </div>
                </div>
            </header>

            <div className="map-wrapper glass">
                {loading ? (
                    <div className="map-loader">
                        <div className="spinner"></div>
                        <span>Chargement de la carte...</span>
                    </div>
                ) : (
                    <MapContainer
                        key={`map-${reports.length > 0 ? 'hydrated' : 'initial'}`}
                        center={[34.26, -5.92]}
                        zoom={14}
                        id="madinti-map-instance"
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <MapInvalidator />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {reports.filter((r: Report) => r.locationLat && r.locationLng).map((report: Report) => (
                            <Marker
                                key={report.id}
                                position={[report.locationLat, report.locationLng]}
                            >
                                <Popup>
                                    <div className="custom-popup">
                                        <div className="popup-category">
                                            {CATEGORY_ICONS[report.category] || '📍'} {report.category}
                                        </div>
                                        <p className="popup-desc">{report.description || 'Pas de description'}</p>
                                        <div className="popup-footer">
                                            <span
                                                className="status-dot"
                                                style={{ backgroundColor: getStatusColor(report.status) }}
                                            ></span>
                                            <span className="status-name">{report.status}</span>
                                            <Link to={`/reports/${report.id}`} className="details-link">Détails →</Link>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>

            <div className="map-legend-bar glass">
                {['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(status => (
                    <div key={status} className="legend-item">
                        <span className="dot" style={{ backgroundColor: getStatusColor(status) }}></span>
                        <span className="label">{status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
