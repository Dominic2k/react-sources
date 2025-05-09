import React, { useState } from 'react';

const CARD_BG = '#fff';
const HEADER_BG = '#e89d4c';
const ICON_COLOR = '#222';
const FONT_FAMILY = 'Segoe UI, Arial, sans-serif';

const icons = [
  { icon: '🎯', label: 'Goals' },
  { icon: '📝', label: 'Plan' },
  { icon: '🏆', label: 'Achievements' },
  { icon: '📔', label: 'Journal' },
  { icon: '👤', label: 'Profile' },
];

const ClassCard = ({ subject, teacher, avatarUrl }) => {
  return (
    <div style={{
      width: 260,
      borderRadius: 16,
      overflow: 'hidden',
      background: CARD_BG,
      boxShadow: '0 2px 8px rgba(108,185,229,0.08)',
      fontFamily: FONT_FAMILY,
      margin: 8,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ background: HEADER_BG, padding: '20px 16px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>{subject}</div>
          <div style={{ color: '#fff', fontSize: 14, marginTop: 4 }}>{teacher}</div>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #6cb9e5' }}>
          {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> : <span style={{ fontSize: 28 }}>👩‍🏫</span>}
        </div>
      </div>
      <div style={{ background: '#f7fafd', padding: '16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {icons.map((i) => (
          <span key={i.label} title={i.label} style={{ fontSize: 22, color: ICON_COLOR, cursor: 'pointer' }}>{i.icon}</span>
        ))}
      </div>
    </div>
  );
};

export default ClassCard; 