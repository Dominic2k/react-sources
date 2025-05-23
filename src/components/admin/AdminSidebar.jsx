import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/login');
    };

    return (
        <div className="admin-sidebar">
            <div className="admin-logo">
                <div className="admin-logo-icon">
                    <span>⚙️</span>
                </div>
                <div className="admin-logo-text">Admin</div>
            </div>
            
            <nav className="admin-nav">
                <div className={`admin-nav-item ${window.location.pathname === '/admin/dashboard' ? 'active' : ''}`} onClick={() => navigate('/admin/dashboard')} >
                    <span className="admin-nav-icon">🏠</span>
                    <span className="admin-nav-text">Dashboard</span>
                </div>

                <div className={`admin-nav-item ${window.location.pathname === '/admin/teachers' ? 'active' : ''}`} onClick={() => navigate('/admin/teachers')} >
                    <span className="admin-nav-icon">👩‍🏫</span>
                    <span className="admin-nav-text">Teachers</span>
                </div>
                
                <div className={`admin-nav-item ${window.location.pathname === '/admin/students' ? 'active' : ''}`} onClick={() => navigate('/admin/students')} >
                    <span className="admin-nav-icon">👨‍🎓</span>
                    <span className="admin-nav-text">Students</span>
                </div>
                
                <div className={`admin-nav-item ${window.location.pathname === '/admin/classes' ? 'active' : ''}`} onClick={() => navigate('/admin/classes')} >
                    <span className="admin-nav-icon">📚</span>
                    <span className="admin-nav-text">Classes</span>
                </div>

                <div className={`admin-nav-item ${window.location.pathname === '/admin/subjects' ? 'active' : ''}`} onClick={() => navigate('/admin/subjects')} >
                    <span className="admin-nav-icon">📚</span>
                    <span className="admin-nav-text">Subjects</span>
                </div>
                
                <div className={`admin-nav-item ${window.location.pathname === '/admin/activity-logs' ? 'active' : ''}`} onClick={() => navigate('/admin/activity-logs')} >
                    <span className="admin-nav-icon">📝</span>
                    <span className="admin-nav-text">Activity logs</span>
                </div>
            </nav>
            
            <div className="admin-logout" onClick={handleLogout}>
                <span className="admin-logout-icon">🚪</span>
                <span className="admin-logout-text">Log Out</span>
            </div>

        </div>
    );
};

export default AdminSidebar;