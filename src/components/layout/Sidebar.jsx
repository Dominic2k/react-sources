import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🗓️', label: 'Calendar', path: '/calendar' },
    { icon: '🏆', label: 'Achievements', path: '/achievements' },
    { icon: '❓', label: 'Help', path: '/help' },
    { icon: '🚪', label: 'Logout', path: '/logout' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-avatar">
        <div className="sidebar-avatar-img">
          <span role="img" aria-label="avatar">👩‍🎓</span>
        </div>
        <div className="sidebar-avatar-name">Student Name</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, idx) => (
          <div
            key={item.label}
            className={`sidebar-item${idx === 0 ? ' active' : ''}`}
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
