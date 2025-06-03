import React, { useState, useEffect } from 'react';
import './NotificationDropdown.css';

function NotificationDropdown({ isOpen, onClose }) {
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('NotificationDropdown isOpen:', isOpen);
        if (isOpen) {
            fetchDeadlines();
        }
    }, [isOpen]);

    const fetchDeadlines = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching deadlines with token:', token);
            const response = await fetch('http://localhost:8000/api/student/deadlines', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch deadlines');
            }

            const result = await response.json();
            console.log('Deadlines response:', result);
            setDeadlines(result.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching deadlines:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'overdue':
                return 'status-badge overdue';
            case 'future':
                return 'status-badge future';
            default:
                return 'status-badge';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'overdue':
                return 'Quá hạn';
            case 'future':
                return 'Sắp tới';
            default:
                return status;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h3>Thông báo</h3>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            
            <div className="notification-content">
                {loading ? (
                    <div className="loading">Đang tải thông báo...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : deadlines.length === 0 ? (
                    <div className="no-notifications">Không có thông báo mới</div>
                ) : (
                    <div className="deadlines-list">
                        {deadlines.map((deadline) => (
                            <div key={deadline.id} className="deadline-item">
                                <div className="deadline-header">
                                    <h4>{deadline.title}</h4>
                                    <span className={getStatusBadgeClass(deadline.status)}>
                                        {getStatusText(deadline.status)}
                                    </span>
                                </div>
                                <p className="deadline-description">{deadline.description}</p>
                                <div className="deadline-details">
                                    <span className="deadline-class">{deadline.class.class_name}</span>
                                    <span className="deadline-date">Hạn chót: {formatDate(deadline.due_date)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationDropdown; 