import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const SidebarTeacher = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'Loading...',
    role: 'Loading...',
    avatar: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:8000/api/user', {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.data.user) {
          const user = data.data.user;
          setUserData({
            name: user.full_name || 'Teacher',
            role: user.role || 'Teacher',
            avatar: user.avatar_url || null
          });
        } else {
          setUserData({
            name: 'Teacher',
            role: 'Teacher',
            avatar: null
          });
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setUserData({
          name: 'Teacher',
          role: 'Teacher',
          avatar: null
        });
      }
    };

    fetchUserData();
  }, []);

  const handleProfileClick = () => navigate('/profile');
  const handleCreateDeadline = () => navigate('/create-deadline');

  const navItems = [
    { icon: '🏫', label: 'Classes', path: '/classes' },
    { icon: '📄', label: 'Reports', path: '/reports' },
    { icon: '⏱️', label: 'Activity log', path: '/activity-log' },
    { icon: '🚪', label: 'Logout', path: '/logout' },
  ];

  return (
    <aside className="sidebar" role="complementary" aria-label="User profile sidebar">
      <div className="sidebar-avatar" onClick={handleProfileClick} title="View Profile">
        <div className="sidebar-avatar-img" aria-label="User avatar">
          {userData.avatar ? (
            <img src={userData.avatar} alt={`Avatar of ${userData.name}`} width="56" height="56" />
          ) : (
            <div style={{ width: 56, height: 56, backgroundColor: '#ccc', borderRadius: '50%' }} />
          )}
        </div>
        <div className="sidebar-avatar-name">{userData.name}</div>
        <div className="sidebar-avatar-role">{userData.role}</div>
      </div>

      <button
        className="btn-deadline"
        type="button"
        aria-label="Create Deadline"
        onClick={handleCreateDeadline}
      >
        📅 Create Deadline
      </button>

      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        {navItems.map(item => (
          <div
            key={item.label}
            className={`sidebar-item${window.location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ marginRight: '8px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarTeacher;
