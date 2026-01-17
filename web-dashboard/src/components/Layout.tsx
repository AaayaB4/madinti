import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, LogOut, Settings, Bell } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
    onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="layout-premium">
            <aside className="sidebar-premium glass">
                <div className="sidebar-header">
                    <div className="logo-box">
                        <span className="logo-icon">🏙️</span>
                        <div className="logo-text">
                            <h1>MADINTI</h1>
                            <span>ADMIN PORTAL</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Tableau de Bord</span>
                    </Link>

                    <Link to="/reports" className={`nav-item ${isActive('/reports') ? 'active' : ''}`}>
                        <FileText size={20} />
                        <span>Signalements</span>
                    </Link>

                    <Link to="/map" className={`nav-item ${isActive('/map') ? 'active' : ''}`}>
                        <Map size={20} />
                        <span>Cartographie</span>
                    </Link>

                    <div className="nav-divider">PROPRIÉTÉS</div>

                    <Link to="#" className="nav-item coming-soon">
                        <Bell size={20} />
                        <span>Notifications</span>
                    </Link>

                    <Link to="#" className="nav-item coming-soon">
                        <Settings size={20} />
                        <span>Paramètres</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-btn-premium">
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            <main className="main-viewport">
                <div className="top-bar glass">
                    <div className="search-placeholder">
                        {/* Search or other top bar items could go here */}
                    </div>
                    <div className="user-profile">
                        <div className="user-info">
                            <span className="name">Admin Madinti</span>
                            <span className="role">Administrateur</span>
                        </div>
                        <div className="avatar">AD</div>
                    </div>
                </div>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
