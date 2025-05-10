import React from 'react';
import GoalCard from './GoalCard';

const GoalSection = ({ title, items, emptyMessage }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ color: '#222', fontWeight: 600, marginBottom: '16px' }}>{title}</h3>
      {items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {items.map(item => (
            <GoalCard key={item.id || Math.random()} goal={item} />
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '24px', 
          background: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '16px', color: '#888' }}>
            {emptyMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSection;