import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import { getGoalsByClass } from '../../services/studentService';

const ClassDetail = () => {
  const { classId } = useParams();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getGoalsByClass(classId);
        setGoals(data);
      } catch (err) {
        setError('Không thể tải goals.');
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [classId]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7fafd' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '32px', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
          <h2 style={{ color: '#222', fontWeight: 600 }}>Goals của môn học</h2>
          {loading && <div>Đang tải goals...</div>}
          {error && <div style={{ color: 'red', margin: '16px 0' }}>{error}</div>}
          <ul>
            {goals.map(goal => (
              <li key={goal.id}>
                <strong>{goal.title}</strong> - {goal.status}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default ClassDetail; 