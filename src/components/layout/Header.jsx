import React from 'react';

const SIDEBAR_BG = '#6cb9e5';
const FONT_FAMILY = 'Segoe UI, Arial, sans-serif';

const Header = () => (
  <header style={{height: 64, background: '#fff', borderBottom: '1px solid #e0e0e0',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', fontFamily: FONT_FAMILY, position: 'sticky', top: 0, zIndex: 10
  }}>
    <div style={{fontWeight: 500, fontSize: 20, color: '#222'}}>Manage learning log</div>
    <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
      <span style={{fontSize: 16, color: '#888'}}>{new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
      <span style={{fontSize: 24, color: SIDEBAR_BG, cursor: 'pointer'}} title="Thông báo">🔔</span>
    </div>
  </header>
);

export default Header; 