import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'Loading...',
    avatar: null
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`http://localhost:8000/api/student/profile`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
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
          setError('Invalid data format');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setUserData({ name: 'Student', avatar: null });
        setError('Failed to load user info');
      }
    };

    fetchUserData();
  }, []);

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🏆', label: 'Achievements', path: '/achievements' },
    { icon: '❓', label: 'Help', path: '/help' },
    { icon: '🚪', label: 'Logout', path: '/logout' },
  ];

  const handleProfileClick = () => {
    navigate('/student/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-avatar">
        <div className="sidebar-avatar-img">
          {userData.avatar ? (
            <img src={userData.avatar} alt="User avatar" />
          ) : (
            <span role="img" aria-label="avatar">👩‍🎓</span>
          )}
        </div>
        <div
          className="sidebar-avatar-name"
          onClick={handleProfileClick}
          title="View Profile"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          {userData.name}
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.label}
            className={`sidebar-item${window.location.pathname === item.path ? ' active' : ''}`}
            onClick={() => item.path === '/logout' ? handleLogout() : navigate(item.path)}
            style={{ cursor: 'pointer' }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      {error && <div className="sidebar-error">{error}</div>}
    </aside>
  );
};

export default Sidebar;
