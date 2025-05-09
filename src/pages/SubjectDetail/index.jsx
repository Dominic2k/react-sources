import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import { getStudentSubjectGoals } from '../../services/studentService';
import GoalSection from '../../components/goals/GoalSection';
import GoalForm from '../../components/goals/GoalForm';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [goalType, setGoalType] = useState('semester'); // 'semester' hoặc 'weekly'
  const [showForm, setShowForm] = useState(false);
  
  // Sử dụng ID học sinh cố định (sau này có thể lấy từ context/redux)
  const studentId = 3; // Thay bằng id thực tế hoặc lấy từ context/state

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStudentSubjectGoals(studentId, subjectId);
      console.log('API response:', response);
      
      // Xử lý dữ liệu trả về
      if (response && response.data && Array.isArray(response.data)) {
        setGoals(response.data);
      } else if (Array.isArray(response)) {
        setGoals(response);
      } else if (response && Array.isArray(response.goals)) {
        setGoals(response.goals);
      } else {
        console.error('Dữ liệu không đúng định dạng mảng:', response);
        setGoals([]);
      }
    } catch (err) {
      setError('Không thể tải goals.');
      console.error('Error fetching goals:', err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [subjectId, studentId]);

  // Lọc goals theo loại - phiên bản linh hoạt hơn
  const semesterGoals = Array.isArray(goals) ? goals.filter(goal => {
    // Kiểm tra nhiều trường hợp có thể có
    return goal.type === 'semester' || 
           goal.goal_type === 'semester' || 
           goal.goalType === 'semester';
  }) : [];

  const weekGoals = Array.isArray(goals) ? goals.filter(goal => {
    // Kiểm tra nhiều trường hợp có thể có
    return goal.type === 'weekly' || 
           goal.goal_type === 'weekly' || 
           goal.goalType === 'weekly';
  }) : [];

  // Lọc plans theo loại - phiên bản linh hoạt hơn
  const inclassPlans = Array.isArray(goals) ? goals.filter(goal => {
    return goal.plan_type === 'inclass' || 
           goal.planType === 'inclass' || 
           goal.plan === 'inclass';
  }) : [];

  const selfPlans = Array.isArray(goals) ? goals.filter(goal => {
    return goal.plan_type === 'self' || 
           goal.planType === 'self' || 
           goal.plan === 'self';
  }) : [];

  // Hiển thị goals theo loại đã chọn
  const displayedGoals = goalType === 'semester' ? semesterGoals : weekGoals;

  // Xử lý khi form tạo goal thành công
  const handleGoalCreated = () => {
    // Tải lại danh sách goals
    fetchGoals();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7fafd' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '32px', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
          {/* Goals Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: '#222', fontWeight: 600, margin: 0 }}>Goals của môn học</h2>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Goal Type Filter */}
              <select 
                value={goalType} 
                onChange={(e) => setGoalType(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  background: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="semester">Mục tiêu học kỳ</option>
                <option value="weekly">Mục tiêu tuần</option>
              </select>
              
              {/* Create Goal Button */}
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#2196F3',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '18px' }}>+</span>
                <span>Tạo goal mới</span>
              </button>
            </div>
          </div>
          
          {/* Loading and error states */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '18px', color: '#666' }}>Đang tải goals...</div>
            </div>
          )}
          
          {error && (
            <div style={{ 
              color: '#fff', 
              background: '#F44336', 
              padding: '12px 16px', 
              borderRadius: '4px', 
              margin: '16px 0' 
            }}>
              {error}
            </div>
          )}
          
          {/* Display content when not loading and no error */}
          {!loading && !error && (
            <>
              {/* Goals Section */}
              <GoalSection 
                title={goalType === 'semester' ? 'Mục tiêu học kỳ' : 'Mục tiêu tuần'} 
                items={displayedGoals} 
                emptyMessage={`Không có ${goalType === 'semester' ? 'mục tiêu học kỳ' : 'mục tiêu tuần'} nào`}
              />
              
              {/* Inclass Plans Section */}
              <GoalSection 
                title="Kế hoạch học trong lớp" 
                items={inclassPlans} 
                emptyMessage="Không có kế hoạch học trong lớp nào"
              />
              
              {/* Self Study Plans Section */}
              <GoalSection 
                title="Kế hoạch tự học" 
                items={selfPlans} 
                emptyMessage="Không có kế hoạch tự học nào"
              />
            </>
          )}
          
          {/* Goal Form Modal */}
          {showForm && (
            <GoalForm 
              studentId={studentId}
              subjectId={subjectId}
              onClose={() => setShowForm(false)}
              onSuccess={handleGoalCreated}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default SubjectDetail; 
