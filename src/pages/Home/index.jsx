import React, { useEffect, useState } from 'react';
import { Sidebar, Header } from '../../components/layout';
import ClassCard from '../../components/ui/ClassCard';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your subjects');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/student/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again');
          localStorage.removeItem('token');
          // You might want to redirect to login page here
          // navigate('/login');
        } else {
          setError('Failed to load subjects');
        }
        setSubjects([]);
        return;
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setSubjects(data.data);
      } else {
        setSubjects([]);
        setError('No subjects found');
      }
    } catch (error) {
      setError('Error loading subjects');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };
  fetchSubjects();
}, []);


  return (
    <div className="home-container">
      <Sidebar />
      <div className="home-main">
        <Header />
        <main className="home-content">
          <h2 className="home-heading">Your Subjects</h2>
          {loading && <div>Loading list...</div>}
          {error && <div className="home-error">{error}</div>}
          <div className="home-class-list">
            {Array.isArray(subjects) && subjects.map((s, idx) => (
              <div
                key={s.subject_id || idx}
                onClick={() => navigate(`/subject/${s.subject_id}`)}
                className="home-class-item"
              >
                <ClassCard
                  subject={s.subject_name}
                  teacher={s.teacher_name}
                  avatarUrl={s.teacher_avatar}
                />
              </div>
            ))}
            {Array.isArray(subjects) && subjects.length === 0 && !loading && (
              <div className="home-empty">
                <div className="home-empty-text">
                  No subjects available
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
