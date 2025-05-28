import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import GoalSection from '../../components/goals/GoalSection';
import GoalForm from '../../components/goals/GoalForm';
import './SubjectDetail.css';
import ShowInClassPlan from '../InClassPlan/ShowInClassPlan';
import axios from 'axios';
import GoalCard from '../../components/goals/GoalCard';
import TeacherTagBox from '../../components/layout/TeacherTagBox';
import SelfStudyFormModal from '../../components/SelfStudyPlan/SelfStudyFormModal';
import InClassFormModal from '../../components/InclassPlan/InclassFormModal';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [goalType, setGoalType] = useState('semester');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('goals');
  const [showInClassModal, setShowInClassModal] = useState(false);
  const [showSelfStudyModal, setShowSelfStudyModal] = useState(false);
  const [classSubjectId, setClassSubjectId] = useState(null);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  // Thêm state mới để lưu self-study plans
  const [selfStudyPlans, setSelfStudyPlans] = useState([]);
  const [loadingSelfStudy, setLoadingSelfStudy] = useState(false);
  const [selfStudyError, setSelfStudyError] = useState('');

  const fetchSubjectDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view subject details');
        return;
      }

      console.log('Fetching subject detail for subjectId:', subjectId);

      const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${subjectId}/detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subject details');
      }

      const data = await response.json();
      console.log('Subject detail response:', data);

      if (data.success && data.data) {
        setSubjectInfo(data.data);
        setClassSubjectId(data.data.class_subject_id);
        console.log('Set classSubjectId to:', data.data.class_subject_id);
        return data.data.class_subject_id;
      } else {
        throw new Error('Invalid subject data');
      }
    } catch (error) {
      console.error('Error fetching subject details:', error);
      setError('Error loading subject details');
      return null;
    }
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view goals');
        setLoading(false);
        return;
      }

      // Lấy class_subject_id từ subject detail
      const classSubjectId = await fetchSubjectDetail();
      if (!classSubjectId) {
        setLoading(false);
        return;
      }

      console.log('Fetching goals for class_subject:', classSubjectId);
      
      const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/goals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again');
          localStorage.removeItem('token');
        } else {
          setError(data.message || 'Failed to load goals');
        }
        setGoals([]);
        return;
      }

      // Kiểm tra cấu trúc dữ liệu trả về
      if (data.success && Array.isArray(data.data)) {
        // console.log('Setting goals:', data.data);
        setGoals(data.data);
      } else if (Array.isArray(data)) {
        // Trường hợp API trả về trực tiếp mảng goals
        // console.log('Setting goals (direct array):', data);
        setGoals(data);
      } else if (data.goals && Array.isArray(data.goals)) {
        // Trường hợp API trả về trong trường goals
        // console.log('Setting goals (from goals field):', data.goals);
        setGoals(data.goals);
      } else {
        // console.log('No valid goals data found in response');
        setGoals([]);
        setError('No goals found');
      }
    } catch (error) {
      // console.error('Error fetching goals:', error);
      setError('Error loading goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchGoals();
  }, [subjectId]);

  const semesterGoals = goals.filter(goal =>
    ['semester'].includes(goal.type || goal.goal_type || goal.goalType)
  );

  const weekGoals = goals.filter(goal =>
    ['weekly'].includes(goal.type || goal.goal_type || goal.goalType)
  );

  const monthlyGoals = goals.filter(goal =>
    ['monthly'].includes(goal.type || goal.goal_type || goal.goalType)
  );

  const customGoals = goals.filter(goal =>
    ['custom'].includes(goal.type || goal.goal_type || goal.goalType)
  );

  const displayedGoals = (() => {
    switch (goalType) {
      case 'semester':
        return semesterGoals;
      case 'weekly':
        return weekGoals;
      case 'monthly':
        return monthlyGoals;
      case 'custom':
        return customGoals;
      default:
        return semesterGoals;
    }
  })();

  const handleGoalCreated = () => {
    fetchGoals();
  };

  // Hàm xử lý khi form In-class được lưu thành công
  const handleInClassFormSuccess = () => {
    setShowInClassModal(false); // Đóng modal
    // Có thể thêm code để refresh danh sách in-class plans
  };

  // Hàm xử lý khi form Self-study được lưu thành công
  const handleSelfStudyFormSuccess = () => {
    setShowSelfStudyModal(false);
    fetchGoals(); // Refresh danh sách goals
  };

  const handleEditGoal = (goal) => setEditingGoal(goal);
  const handleCloseEditForm = () => setEditingGoal(null);
  const handleUpdateSuccess = () => {
    fetchGoals();
    setEditingGoal(null);
  };

  // Thêm hàm fetchSelfStudyPlans
  const fetchSelfStudyPlans = async () => {
    try {
      setLoadingSelfStudy(true);
      setSelfStudyError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setSelfStudyError('Please login to view plans');
        setLoadingSelfStudy(false);
        return;
      }

      if (!subjectId) {
        setLoadingSelfStudy(false);
        return;
      }

      console.log('Fetching self-study plans for subject:', subjectId);
      
      const response = await fetch(`http://localhost:8000/api/student/subject/${subjectId}/self-study-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch self-study plans');
      }

      const data = await response.json();
      // console.log('Self-study plans response:', data);

      if (Array.isArray(data)) {
        setSelfStudyPlans(data);
      } else if (data.data && Array.isArray(data.data)) {
        setSelfStudyPlans(data.data);
      } else {
        setSelfStudyPlans([]);
      }
    } catch (error) {
      // console.error('Error fetching self-study plans:', error);
      setSelfStudyError('Error loading self-study plans');
      setSelfStudyPlans([]);
    } finally {
      setLoadingSelfStudy(false);
    }
  };

  // Thêm useEffect để gọi API khi tab selfstudy được chọn
  useEffect(() => {
    if (activeTab === 'selfstudy' && classSubjectId) {
      fetchSelfStudyPlans();
    }
  }, [activeTab, classSubjectId]);

  return (
    <div className="subject-detail-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="subject-content">
          {/* Navigation menu */}
          <div className="subject-nav-tabs">
            <button 
              className={`subject-nav-tab ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              Goals
            </button>
            <button 
              className={`subject-nav-tab ${activeTab === 'inclass' ? 'active' : ''}`}
              onClick={() => setActiveTab('inclass')}
            >
              In-class Plans
            </button>
            <button 
              className={`subject-nav-tab ${activeTab === 'selfstudy' ? 'active' : ''}`}
              onClick={() => setActiveTab('selfstudy')}
            >
              Self-study Plans
            </button>
          </div>

          {/* Goals Tab Content */}
          {activeTab === 'goals' && (
            <>
              <div className="subject-detail-header">
                <h2 className="subject-detail-title">Subject Goals</h2>
                <div className="subject-detail-actions">
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="subject-detail-select"
                  >
                    <option value="semester">Semester Goals</option>
                    <option value="weekly">Weekly Goals</option>
                    <option value="monthly">Monthly Goals</option>
                    <option value="custom">Custom Goals</option>
                  </select>
                  <button
                    onClick={() => setShowForm(true)}
                    className="subject-detail-button"
                  >
                    <span style={{ fontSize: '18px' }}>+</span>
                    <span>Create New Goal</span>
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <TeacherTagBox entityId={classSubjectId} entityType="goal" />
              </div>
              {loading && <div className="subject-detail-loading">Loading goals...</div>}
              {error && <div className="subject-detail-error">{error}</div>}

              {!loading && !error && (
                <>
                  <GoalSection
                    title="Goals"
                    items={displayedGoals}
                    emptyMessage={`No ${goalType} goals available for this subject`}
                    onEditGoal={handleEditGoal}
                  />
                  {editingGoal && (
                    <GoalForm
                      goal={editingGoal}
                      class_subject_id={classSubjectId}
                      onClose={handleCloseEditForm}
                      onSuccess={handleUpdateSuccess}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* In-class Plans Tab Content */}
          {activeTab === 'inclass' && (
            <div className="inclass-plans-container">
              <h2 className="subject-detail-title">In-class Learning Plans</h2>
              
              {/* Hiển thị bảng danh sách in-class plans */}
              <ShowInClassPlan subjectId={subjectId} />
              
              <button
                onClick={() => setShowInClassModal(true)}
                className="subject-detail-button"
              >
                <span style={{ fontSize: '18px' }}>+</span>
                <span>Create New In-class Plan</span>
              </button>
            </div>
          )}

          {/* Self-study Plans Tab Content */}
          {activeTab === 'selfstudy' && (
            <div className="selfstudy-plans-container">
              <h2 className="subject-detail-title">Self-study Learning Plans</h2>
                            {/* ✅ Teacher Tag Component */}
              <div style={{ marginTop: '2rem' }}>
                <TeacherTagBox entityId={classSubjectId} entityType="self_study_plan" />
              </div>
              
              {loadingSelfStudy && <div className="subject-detail-loading">Loading plans...</div>}
              {selfStudyError && <div className="subject-detail-error">{selfStudyError}</div>}
              {!loadingSelfStudy && !selfStudyError && (
                <div className="self-study-list">
                  {selfStudyPlans.length > 0 ? (
                    <ul className="plan-list">
                      {selfStudyPlans.map((plan) => (
                        <li key={plan.id} className="plan-item">
                          <Link to={`/self-study-plans/${plan.lesson || 'class'}/${plan.id}?subjectId=${classSubjectId}`}>
                            <div className="plan-item-title">
                              <strong>{plan.lesson || 'Unnamed Plan'}</strong>
                            </div>
                            <div className="plan-item-details">
                              <span>📅 {plan.date || 'No date'}</span>
                              <span>⏰ {plan.time || 'No time'}</span>
                              <span>📚 {plan.resources ? (plan.resources.length > 20 ? plan.resources.substring(0, 20) + '...' : plan.resources) : 'No resources'}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-message">No self-study plans available</p>
                  )}
                </div>
              )}

              <button 
                onClick={() => setShowSelfStudyModal(true)}
                className="subject-detail-button create-button"
              >
                <span style={{ fontSize: '18px' }}>+</span>
                <span>Create New Self-study Plan</span>
              </button>
            </div>
          )}
          {/* Modal cho Goal Form */}
          {showForm && classSubjectId && (
            <GoalForm
              class_subject_id={classSubjectId}
              onClose={() => setShowForm(false)}
              onSuccess={handleGoalCreated}
            />
          )}
          {showForm && !classSubjectId && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>Error</h2>
                  <button 
                    className="modal-close-button" 
                    onClick={() => setShowForm(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-content">
                  <p>Cannot create goal: Subject information is not loaded yet. Please try again.</p>
                </div>
              </div>
            </div>
          )}

          {/* Modal cho việc thêm mới In-class Plan */}
          {showInClassModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>Create New In-class Plan</h2>
                  <button 
                    className="modal-close-button" 
                    onClick={() => setShowInClassModal(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-content">
                  <InClassFormModal 
                    subjectId={subjectId} 
                    onClose={() => setShowInClassModal(false)}
                    onSuccess={handleInClassFormSuccess}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal cho việc thêm mới Self-study Plan */}
          {showSelfStudyModal && (
            <div className="modal-overlay">
              <div className="modal-container self-study-modal">
                <div className="modal-header">
                  <h2>Create New Self-study Plan</h2>
                  <button 
                    className="modal-close-button" 
                    onClick={() => setShowSelfStudyModal(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-content">
                  <SelfStudyFormModal
                    subjectId={subjectId} 
                    onClose={() => setShowSelfStudyModal(false)}
                    onSuccess={handleSelfStudyFormSuccess}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
