import React, { useEffect, useState } from 'react';
import { Sidebar, Header } from '../../components/layout';
import ClassCard from '../../components/ui/ClassCard';
import { getStudentSubjects } from '../../services/studentService';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const studentId = 3;

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getStudentSubjects(studentId);
        if (Array.isArray(data)) {
          setSubjects(data);
        } else if (data && Array.isArray(data.data)) {
          setSubjects(data.data);
        } else if (data && Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
        } else {
          console.error('Data is not in array format:', data);
          setSubjects([]);
        }
      } catch (err) {
        setError('Unable to load subject list.');
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [studentId]);

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
