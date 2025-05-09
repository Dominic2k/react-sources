import React from 'react';
import './GoalCard.css';

const GoalCard = ({ goal }) => {
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
      className="goal-card" 
      style={{ borderLeft: `4px solid ${getStatusColor(goal.status)}` }}
    >
      <div className="goal-header">
        <h3 className="goal-title">{goal.title}</h3>
        <span 
          className="goal-status"
          style={{ background: getStatusColor(goal.status) }}
        >
          {goal.status}
        </span>
      </div>
      <p className="goal-description">{goal.description}</p>
      <div className="goal-footer">
        <span>Loại: {goal.type === 'semester' ? 'Học kỳ' : 'Tuần'}</span>
        <span>Kế hoạch: {goal.plan_type === 'inclass' ? 'Trong lớp' : 'Tự học'}</span>
        {goal.deadline && <span>Hạn: {new Date(goal.deadline).toLocaleDateString()}</span>}
      </div>
    </div>
  );
};

export default GoalCard;
