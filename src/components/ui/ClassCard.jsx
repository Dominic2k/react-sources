import React from 'react';
import './ClassCard.css';

const icons = [
  { icon: '🎯', label: 'Goals' },
  { icon: '📝', label: 'Plan' },
  { icon: '🏆', label: 'Achievements' },
  { icon: '📔', label: 'Journal' },
  { icon: '👤', label: 'Profile' },
];

const ClassCard = ({ subject, teacher, avatarUrl }) => {
  return (
    <div className="class-card">
      <div className="class-card-header">
        <div>
          <div className="class-card-header-title"><strong>{subject}</strong></div>
          <div className="class-card-header-teacher"><i>{teacher}</i></div>
        </div>
        <div className="class-card-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" />
          ) : (
            <span style={{ fontSize: 28 }}>👩‍🏫</span>
          )}
        </div>
      </div>
      <div className="class-card-footer">
        {icons.map((i) => (
          <span key={i.label} className="class-card-icon" title={i.label}>
            {i.icon}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ClassCard;
