import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import { getStudentSubjectGoals } from '../../services/studentService';
import GoalSection from '../../components/goals/GoalSection';
import GoalForm from '../../components/goals/GoalForm';
import './SubjectDetail.css';
import ShowInClassForm from '../ShowInClassForm';
import InClassFormContent from '../InClassForm';
import ViewSelfStudyPlan from '../StudyPlan/ViewSelfStudyPlanTable';
import axios from 'axios';
import GoalCard from '../../components/goals/GoalCard';

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
  const [selectedPlanId, setSelectedPlanId] = React.useState(null);

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
        console.log('Setting goals:', data.data);
        setGoals(data.data);
      } else if (Array.isArray(data)) {
        // Trường hợp API trả về trực tiếp mảng goals
        console.log('Setting goals (direct array):', data);
        setGoals(data);
      } else if (data.goals && Array.isArray(data.goals)) {
        // Trường hợp API trả về trong trường goals
        console.log('Setting goals (from goals field):', data.goals);
        setGoals(data.goals);
      } else {
        console.log('No valid goals data found in response');
        setGoals([]);
        setError('No goals found');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Error loading goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchGoals();
  }, [subjectId]);

  // Add useEffect to log classSubjectId changes
  useEffect(() => {
    console.log('classSubjectId changed:', classSubjectId);
  }, [classSubjectId]);

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

  const inclassPlans = goals.filter(goal =>
    ['inclass'].includes(goal.plan_type || goal.planType || goal.plan)
  );

  const selfPlans = goals.filter(goal =>
    ['self'].includes(goal.plan_type || goal.planType || goal.plan)
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
const studentId = localStorage.getItem("user_id");
  return (
    <div className="subject-detail-container">
      <Sidebar />
      <div className="subject-detail-main">
        <Header />
        <main className="subject-detail-content">
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

              {loading && <div className="subject-detail-loading">Loading goals...</div>}
              {error && <div className="subject-detail-error">{error}</div>}

              {!loading && !error && (
                <>
                  <div className="subject-detail-goals">
                    {Array.isArray(displayedGoals) && displayedGoals.map((goal, idx) => (
                      <GoalCard key={goal.id || idx} goal={goal} />
                    ))}
                    {Array.isArray(displayedGoals) && displayedGoals.length === 0 && !loading && (
                      <div className="subject-detail-empty">
                        <div className="subject-detail-empty-text">
                          No {goalType} goals available for this subject
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* In-class Plans Tab Content */}
          {activeTab === 'inclass' && (
            <div className="inclass-plans-container">
              <h2 className="subject-detail-title">In-class Learning Plans</h2>
              
              {/* Hiển thị bảng danh sách in-class plans */}
              <ShowInClassForm subjectId={classSubjectId} />
              
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

              {/* Truyền selectedPlanId vào ViewSelfStudyPlan */}
              <ViewSelfStudyPlan selectedPlanId={selectedPlanId} />

              {loading && <div className="subject-detail-loading">Loading plans...</div>}

              {!loading && (
                <div className="self-study-list">
                  {selfPlans.length > 0 ? (
                    <ul className="plan-list">
                      {selfPlans.map((plan) => (
                        <li 
                          key={plan.id} 
                          className="plan-item" 
                          style={{ cursor: 'pointer', fontWeight: selectedPlanId === plan.id ? 'bold' : 'normal' }}
                          onClick={() => setSelectedPlanId(plan.id)} // Bấm chọn kế hoạch
                        >
                          {/* Link vẫn giữ, hoặc có thể thay bằng onClick để chọn kế hoạch */}
                          <strong>{plan.classSubjectId || 'Unnamed Plan'}</strong> - {plan.date || 'No date'}
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

          {/* Modal cho In-class Form */}
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
                    subjectId={classSubjectId} 
                    onClose={() => setShowInClassModal(false)}
                    onSuccess={handleInClassFormSuccess}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal cho Self-study Form */}
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
                  studentId={studentId}
                    subjectId={subjectId} 
                    onClose={() => setShowSelfStudyModal(false)}
                    onSuccess={handleSelfStudyFormSuccess}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Component mới cho In-class Form dạng modal
const InClassFormModal = ({ subjectId, onClose, onSuccess }) => {
  const [date, setDate] = useState(''); // Thêm state date
  const [module, setModule] = useState('IT English');
  const [lesson, setLesson] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [plan, setPlan] = useState('');
  const [solved, setSolved] = useState('Yes');

  const handleReset = () => {
    setDate('');
    setModule('IT English');
    setLesson('');
    setDifficultyLevel('');
    setDifficulties('');
    setPlan('');
    setSolved('Yes');
  };

  const handleSave = async () => {
    // Kiểm tra trường bắt buộc
    if (!date) {
      alert('Please select a date');
      return;
    }

    const data = {
      date,
      skills_module: module,
      lesson_summary: lesson,
      self_assessment: difficultyLevel,
      difficulties_faced: difficulties,
      improvement_plan: plan,
      problem_solved: solved === 'Yes' ? 1 : 0,
      subject_id: subjectId
    };

    console.log('Sending data:', data); // Log dữ liệu gửi đi

    try {
      const response = await fetch('http://127.0.0.1:8000/api/in-class-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Saved entry:', result);
      alert('Saved successfully!');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert(`Failed to save entry: ${error.message}`);
    }
  };

  return (
    <div className="inclass-form-modal">
      <form className="journal-form">
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Skills/Module</label>
          <select value={module} onChange={(e) => setModule(e.target.value)}>
            <option value="IT English">IT English</option>
            <option value="TOEIC">TOEIC</option>
            <option value="SPEAKING">SPEAKING</option>
          </select>
        </div>

        <div className="form-group">
          <label>My lesson – What did I learn?</label>
          <input 
            type="text" 
            value={lesson} 
            onChange={(e) => setLesson(e.target.value)} 
            placeholder="Enter what you learned today"
          />
        </div>

        <div className="form-group">
          <label>Self-assessment</label>
          <div className="radio-group">
            <label><input type="radio" name="difficulty" value="1" onChange={(e) => setDifficultyLevel(e.target.value)} /> 1. I need more practice</label>
            <label><input type="radio" name="difficulty" value="2" onChange={(e) => setDifficultyLevel(e.target.value)} /> 2. I sometimes find this difficult</label>
            <label><input type="radio" name="difficulty" value="3" onChange={(e) => setDifficultyLevel(e.target.value)} /> 3. No problem!</label>
          </div>
        </div>

        <div className="form-group">
          <label>My difficulties</label>
          <input 
            type="text" 
            value={difficulties} 
            onChange={(e) => setDifficulties(e.target.value)} 
            placeholder="Enter difficulties you faced"
          />
        </div>

        <div className="form-group">
          <label>My plan</label>
          <input 
            type="text" 
            value={plan} 
            onChange={(e) => setPlan(e.target.value)} 
            placeholder="Enter your improvement plan"
          />
        </div>

        <div className="form-group">
          <label>Problem solved</label>
          <select value={solved} onChange={(e) => setSolved(e.target.value)}>
            <option>Yes</option>
            <option>Not Yet</option>
          </select>
        </div>

        <div className="button-group">
          <button type="button" onClick={handleSave} className="save-button">Save</button>
          <button type="button" onClick={handleReset} className="reset-button">Reset</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

// Component mới cho Self-study Form dạng modal
const SelfStudyFormModal = ({ studentId, subjectId, onClose, onSuccess }) => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    module: '',
    lesson: '',
    time: '',
    resources: '',
    activities: '',
    concentration: 'Yes',
    planFollow: 'Not sure',
    evaluation: '',
    reinforcing: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      module: '',
      lesson: '',
      time: '',
      resources: '',
      activities: '',
      concentration: 'Yes',
      planFollow: 'Not sure',
      evaluation: '',
      reinforcing: '',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      goal_id: null, // Không cần goal_id khi tạo mới
      subject_id: subjectId,
      date: today,
      module: formData.module,
      lesson: formData.lesson,
      time: formData.time,
      resources: formData.resources,
      activities: formData.activities,
      concentration: formData.concentration,
      plan_follow: formData.planFollow,
      evaluation: formData.evaluation,
      reinforcing: formData.reinforcing,
      notes: formData.notes,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/api/student/subjects/${subjectId}/self-study-plans`, payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Study plan saved successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error response:', error.response?.data);
      alert('Failed to save study plan');
    }
  };

  return (
    <div className="self-study-form-modal">
      <form className="study-plan-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="module">Module</label>
          <input 
          type="text"
            id="module"
            name="module"
            value={formData.module}
            onChange={handleChange}
            required
            placeholder="What are you studied today?"
            />
        </div>

        <div className="form-group">
          <label htmlFor="lesson">My lesson - What did I learn?</label>
          <input 
            type="text" 
            id="lesson" 
            name="lesson" 
            value={formData.lesson} 
            onChange={handleChange} 
            placeholder="Enter what you learned"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="time">Time I</label>
            <input 
              type="text" 
              id="time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              placeholder="e.g. 2 hours"
            />
          </div>
          <div className="form-group half">
            <label htmlFor="resources">Learning resources</label>
            <textarea
              id="resources"
              name="resources"
              rows="2"
              value={formData.resources}
              onChange={handleChange}
              placeholder="Books, websites, etc."
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="activities">Learning activities</label>
          <textarea 
            id="activities" 
            name="activities" 
            rows="2" 
            value={formData.activities} 
            onChange={handleChange}
            placeholder="What activities did you do?"
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="concentration">Concentration</label>
            <select 
              id="concentration" 
              name="concentration" 
              value={formData.concentration} 
              onChange={handleChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="form-group half">
            <label htmlFor="planFollow">Plan & follow plan</label>
            <select 
              id="planFollow" 
              name="planFollow" 
              value={formData.planFollow} 
              onChange={handleChange}
            >
              <option value="Not sure">Not sure</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="evaluation">Evaluation of my work</label>
          <textarea 
            id="evaluation" 
            name="evaluation" 
            rows="2" 
            value={formData.evaluation} 
            onChange={handleChange}
            placeholder="How would you evaluate your work?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reinforcing">Reinforcing learning</label>
          <textarea 
            id="reinforcing" 
            name="reinforcing" 
            rows="2" 
            value={formData.reinforcing} 
            onChange={handleChange}
            placeholder="How will you reinforce what you learned?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea 
            id="notes" 
            name="notes" 
            rows="2" 
            value={formData.notes} 
            onChange={handleChange}
            placeholder="Notes"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="save-button">Save</button>
          <button type="button" onClick={handleReset} className="reset-button">Reset</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default SubjectDetail;
