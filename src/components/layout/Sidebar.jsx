import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/student/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Profile response:', response.data);

        if (response.data.success && response.data.data) {
          const profileData = response.data.data;
          setUserData({
            name: profileData.full_name || 'Student',
            avatar: profileData.avatar_url || null
          });
        } else {
          console.warn('Invalid profile data format:', response.data);
          setUserData({ name: 'Student', avatar: null });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setUserData({ name: 'Student', avatar: null });
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
            onClick={() => item.path === '/logout' ? handleLogout() : navigate(item.path)}
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
