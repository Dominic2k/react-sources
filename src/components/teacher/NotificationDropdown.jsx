import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationDropdown.css';

function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTags = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/teacher-tags/mytags', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                setTags(response.data.data);
            } else {
                setError('Failed to fetch tags');
            }
        } catch (err) {
            console.error('Error fetching tags:', err);
            setError('Failed to fetch tags');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTags();
        }
    }, [isOpen]);

    return (
        <div className="notification-dropdown">
            <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
                <span>🔔</span>
                {tags.length > 0 && <span className="notification-badge">{tags.length}</span>}
            </div>
            
            {isOpen && (
                <div className="notification-content">
                    <div className="notification-header">
                        <h3>Teacher Tags</h3>
                        <button onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : tags.length === 0 ? (
                        <div className="no-tags">No tags found</div>
                    ) : (
                        <div className="tags-list">
                            {tags.map((tag) => (
                                <div key={tag.id} className="tag-item">
                                    <div className="tag-header">
                                        <span className="student-name">{tag.student_name}</span>
                                        <span className="tag-date">{new Date(tag.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="tag-content">
                                        <p>{tag.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown; 