import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminSidebar.module.css';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/login');
    };

    const isActive = (path) => window.location.pathname === path ? styles.active : '';

    return (
        <div className={styles['admin-sidebar']}>
            <div className={styles['admin-logo']}>
                <div className={styles['admin-logo-icon']}>
                    <span>⚙️</span>
                </div>
                <div className={styles['admin-logo-text']}>Admin</div>
            </div>
            
            <nav className={styles['admin-nav']}>
                <div className={`${styles['admin-nav-item']} ${isActive('/admin/activity-logs')}`} onClick={() => navigate('/admin/activity-logs')} >
                    <span className={styles['admin-nav-icon']}>📝</span>
                    <span className={styles['admin-nav-text']}>Activity Logs</span>
                </div>

                <div className={`${styles['admin-nav-item']} ${isActive('/admin/teachers')}`} onClick={() => navigate('/admin/teachers')} >
                    <span className={styles['admin-nav-icon']}>👩‍🏫</span>
                    <span className={styles['admin-nav-text']}>Teachers</span>
                </div>
                
                <div className={`${styles['admin-nav-item']} ${isActive('/admin/students')}`} onClick={() => navigate('/admin/students')} >
                    <span className={styles['admin-nav-icon']}>👨‍🎓</span>
                    <span className={styles['admin-nav-text']}>Students</span>
                </div>
                
                <div className={`${styles['admin-nav-item']} ${isActive('/admin/classes')}`} onClick={() => navigate('/admin/classes')} >
                    <span className={styles['admin-nav-icon']}>📚</span>
                    <span className={styles['admin-nav-text']}>Classes</span>
                </div>

                <div className={`${styles['admin-nav-item']} ${isActive('/admin/subjects')}`} onClick={() => navigate('/admin/subjects')} >
                    <span className={styles['admin-nav-icon']}>📚</span>
                    <span className={styles['admin-nav-text']}>Subjects</span>
                </div>
            </nav>
            
            <div className={styles['admin-logout']} onClick={handleLogout}>
                <span className={styles['admin-logout-icon']}>🚪</span>
                <span className={styles['admin-logout-text']}>Log Out</span>
            </div>

        </div>
    );
};

export default AdminSidebar;
