import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'Loading...',
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
            name: user.full_name || 'Student',
            avatar: user.avatar_url || null
          });
        } else {
          setUserData({ name: 'Student', avatar: null });
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setUserData({ name: 'Student', avatar: null });
      }
    };

    fetchUserData();
  }, []);

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🗓️', label: 'Calendar', path: '/calendar' },
    { icon: '🏆', label: 'Achievements', path: '/achievements' },
    { icon: '❓', label: 'Help', path: '/help' },
    { icon: '🚪', label: 'Logout', path: '/logout' },
  ];

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <aside className="sidebar">
      <div 
        className="sidebar-avatar" 
        onClick={handleProfileClick}
        title="View Profile"
      >
        <div className="sidebar-avatar-img">
          {userData.avatar ? (
            <img src={userData.avatar} alt="User avatar" />
          ) : (
            <span role="img" aria-label="avatar">👩‍🎓</span>
          )}
        </div>
        <div className="sidebar-avatar-name">{userData.name}</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.label}
            className={`sidebar-item${window.location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
