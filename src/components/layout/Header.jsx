import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '../student/NotificationDropdown';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        setUserRole(role);
    }, []);

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    return (
        <header className="header">
            <div className="header-title">Manage learning log</div>
            <div className="header-right">
                <span className="header-date">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
                {userRole === 'student' && (
                    <span className="header-notification" onClick={toggleNotification} title="Notification">
                        🔔
                    </span>
                )}
            </div>
            {userRole === 'student' && (
                <NotificationDropdown 
                    isOpen={isNotificationOpen} 
                    onClose={() => setIsNotificationOpen(false)} 
                />
            )}
        </header>
    );
}

export default Header;
