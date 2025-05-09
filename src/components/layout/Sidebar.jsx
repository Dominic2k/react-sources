import React from 'react';
import './Sidebar.css';

const SIDEBAR_BG = '#6cb9e5';
const SIDEBAR_ACTIVE = '#e89d4c';
const TEXT_COLOR = '#222';
const FONT_FAMILY = 'Segoe UI, Arial, sans-serif';

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-avatar">
      <div className="sidebar-avatar-img">
        <span role="img" aria-label="avatar">👩‍🎓</span>
      </div>
      <div className="sidebar-avatar-name">Student Name</div>
    </div>
    <nav className="sidebar-nav">
      {[
        {icon: '🏠', label: 'Home'},
        {icon: '🗓️', label: 'Calendar'},
        {icon: '📝', label: 'Study Plan'},
        {icon: '🎯', label: 'My Goals'},
        {icon: '🏆', label: 'Achievements'},
        {icon: '📔', label: 'Journal'},
        {icon: '❓', label: 'Help'},
        {icon: '🚪', label: 'Logout'},
      ].map((item, idx) => (
        <div key={item.label} className={`sidebar-item${idx === 0 ? ' active' : ''}`}>
          <span style={{fontSize: 20}}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  </aside>
);

export default Sidebar; 