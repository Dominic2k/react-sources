import React from 'react';

const GoalCard = ({ goal }) => {
  // Hàm lấy màu theo trạng thái
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'hoàn thành':
        return '#4CAF50';
      case 'in progress':
      case 'đang thực hiện':
        return '#2196F3';
      case 'pending':
      case 'chờ xử lý':
        return '#FF9800';
      case 'overdue':
      case 'quá hạn':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div 
      style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '16px',
        borderLeft: `4px solid ${getStatusColor(goal.status)}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{goal.title}</h3>
        <span 
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '14px',
            background: getStatusColor(goal.status),
            color: '#fff'
          }}
        >
          {goal.status}
        </span>
      </div>
      <p style={{ margin: '8px 0', color: '#666' }}>{goal.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '14px', color: '#888' }}>
        <span>Loại: {goal.type === 'semester' ? 'Học kỳ' : 'Tuần'}</span>
        <span>Kế hoạch: {goal.plan_type === 'inclass' ? 'Trong lớp' : 'Tự học'}</span>
        {goal.deadline && <span>Hạn: {new Date(goal.deadline).toLocaleDateString()}</span>}
      </div>
    </div>
  );
};

export default GoalCard;