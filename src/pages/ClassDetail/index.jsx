import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import { getStudentSubjectGoals } from '../../services/studentService';
import './ClassDetail.css';

const ClassDetail = () => {
  const { classId } = useParams();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Hardcoded student ID - bạn có thể lấy từ localStorage hoặc context
  const studentId = 3;

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError('');
        // Sử dụng classId như class_subject_id
        const response = await getStudentSubjectGoals(studentId, classId);
        
        // Kiểm tra cấu trúc dữ liệu trả về
        if (response?.data && Array.isArray(response.data)) {
          setGoals(response.data);
        } else if (Array.isArray(response)) {
          setGoals(response);
        } else if (response?.goals && Array.isArray(response.goals)) {
          setGoals(response.goals);
        } else {
          console.error('Data is not in array format:', response);
          setGoals([]);
        }
      } catch (err) {
        setError('Unable to load goals.');
        console.error('Error fetching goals:', err);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [classId, studentId]);

  return (
    <div className="class-detail-container">
      <Sidebar />
      <div className="class-detail-main">
        <Header />
        <main className="class-detail-content">
          <h2 className="class-detail-heading">Goals of the Subject</h2>
          {loading && <div>Loading goals...</div>}
          {error && <div className="class-detail-error">{error}</div>}
          <ul>
            {goals.map(goal => (
              <li key={goal.id || Math.random()}>
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