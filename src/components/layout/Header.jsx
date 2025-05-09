import React from 'react';
import './Header.css';

const Header = () => (
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
      <span className="header-notification" title="Thông báo">🔔</span>
    </div>
  </header>
);

export default Header;
