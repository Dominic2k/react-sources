import React, { useEffect, useState } from 'react';
import { Sidebar, Header } from '../../components/layout';
import ClassCard from '../../components/ui/ClassCard';
import { getStudentSubjects } from '../../services/studentService';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const studentId = 3; // Thay bằng id thực tế

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getStudentSubjects(studentId);
        console.log('API raw data:', data);
        
        // Đảm bảo subjects luôn là một mảng
        if (Array.isArray(data)) {
          setSubjects(data);
        } else if (data && Array.isArray(data.data)) {
          setSubjects(data.data);
        } else if (data && Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
        } else {
          console.error('Dữ liệu không đúng định dạng mảng:', data);
          setSubjects([]);
        }
      } catch (err) {
        setError('Không thể tải danh sách môn học.');
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [studentId]);
  
  console.log('Subjects:', subjects, Array.isArray(subjects));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7fafd' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '32px', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
          <h2 style={{ color: '#222', fontWeight: 600 }}>Các môn học của bạn</h2>
          {loading && <div>Đang tải danh sách...</div>}
          {error && <div style={{ color: 'red', margin: '16px 0' }}>{error}</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            {Array.isArray(subjects) && subjects.map((s, idx) => (
              <div
                key={s.subject_id || idx}
                onClick={() => navigate(`/subject/${s.subject_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <ClassCard
                  subject={s.subject_name}
                  teacher={s.teacher_name}
                  avatarUrl={s.teacher_avatar}
                />
              </div>
            ))}
            {Array.isArray(subjects) && subjects.length === 0 && !loading && (
              <div style={{ 
                width: '100%', 
                textAlign: 'center', 
                padding: '32px', 
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '16px', color: '#888' }}>
                  Không có môn học nào
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
