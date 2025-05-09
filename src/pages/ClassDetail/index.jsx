import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import { getGoalsByClass } from '../../services/studentService';
import './ClassDetail.css';

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
    <div className="class-detail-container">
      <Sidebar />
      <div className="class-detail-main">
        <Header />
        <main className="class-detail-content">
          <h2 className="class-detail-heading">Goals của môn học</h2>
          {loading && <div>Đang tải goals...</div>}
          {error && <div className="class-detail-error">{error}</div>}
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
