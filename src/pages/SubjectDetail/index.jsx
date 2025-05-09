import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import { getStudentSubjectGoals } from '../../services/studentService';
import GoalSection from '../../components/goals/GoalSection';
import GoalForm from '../../components/goals/GoalForm';
import './SubjectDetail.css';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [goalType, setGoalType] = useState('semester');
  const [showForm, setShowForm] = useState(false);
  const studentId = 3;

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStudentSubjectGoals(studentId, subjectId);
      if (response?.data && Array.isArray(response.data)) {
        setGoals(response.data);
      } else if (Array.isArray(response)) {
        setGoals(response);
      } else if (response?.goals && Array.isArray(response.goals)) {
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

  const semesterGoals = goals.filter(goal =>
    ['semester'].includes(goal.type || goal.goal_type || goal.goalType)
  );

  const weekGoals = goals.filter(goal =>
    ['weekly'].includes(goal.type || goal.goal_type || goal.goalType)
  );

  const inclassPlans = goals.filter(goal =>
    ['inclass'].includes(goal.plan_type || goal.planType || goal.plan)
  );

  const selfPlans = goals.filter(goal =>
    ['self'].includes(goal.plan_type || goal.planType || goal.plan)
  );

  const displayedGoals = goalType === 'semester' ? semesterGoals : weekGoals;

  const handleGoalCreated = () => {
    fetchGoals();
  };

  return (
    <div className="subject-detail-container">
      <Sidebar />
      <div className="subject-detail-main">
        <Header />
        <main className="subject-detail-content">
          <div className="subject-detail-header">
            <h2 className="subject-detail-title">Goals của môn học</h2>
            <div className="subject-detail-actions">
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="subject-detail-select"
              >
                <option value="semester">Mục tiêu học kỳ</option>
                <option value="weekly">Mục tiêu tuần</option>
              </select>
              <button
                onClick={() => setShowForm(true)}
                className="subject-detail-button"
              >
                <span style={{ fontSize: '18px' }}>+</span>
                <span>Tạo goal mới</span>
              </button>
            </div>
          </div>

          {loading && <div className="subject-detail-loading">Đang tải goals...</div>}

          {error && <div className="subject-detail-error">{error}</div>}

          {!loading && !error && (
            <>
              <GoalSection
                title={goalType === 'semester' ? 'Mục tiêu học kỳ' : 'Mục tiêu tuần'}
                items={displayedGoals}
                emptyMessage={`Không có ${goalType === 'semester' ? 'mục tiêu học kỳ' : 'mục tiêu tuần'} nào`}
              />
              <GoalSection
                title="Kế hoạch học trong lớp"
                items={inclassPlans}
                emptyMessage="Không có kế hoạch học trong lớp nào"
              />
              <GoalSection
                title="Kế hoạch tự học"
                items={selfPlans}
                emptyMessage="Không có kế hoạch tự học nào"
              />
            </>
          )}

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
