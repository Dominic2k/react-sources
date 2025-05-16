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
  const studentId = 1;
 

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
                  <GoalSection
                    title={goalType === 'semester' ? 'Semester Goals' : 'Weekly Goals'}
                    items={displayedGoals}
                    emptyMessage={`No ${goalType === 'semester' ? 'semester goals' : 'weekly goals'} available`}
                  />
                </>
              )}
            </>
          )}

          {/* In-class Plans Tab Content */}
          {activeTab === 'inclass' && (
            <div className="inclass-plans-container">
              <h2 className="subject-detail-title">In-class Learning Plans</h2>
              
              {/* Hiển thị bảng danh sách in-class plans */}
              <ShowInClassForm subjectId={subjectId} />
              
              <button
                onClick={() => setShowInClassModal(true)} // Mở modal thay vì chuyển trang
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
              <ViewSelfStudyPlan />
              {loading && <div className="subject-detail-loading">Loading plans...</div>}
              {!loading && (
                <div className="self-study-list">
                  {selfPlans.length > 0 ? (
                    <ul className="plan-list">
                      {selfPlans.map((plan) => (
                        <li key={plan.id} className="plan-item">
                          <Link to={`/self-study-plans/${plan.class_name || 'class'}/${plan.id}`}>
                            <strong>{plan.class_name || 'Unnamed Plan'}</strong> - {plan.date || 'No date'}
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
          {showForm && (
            <GoalForm
              studentId={studentId}
              subjectId={subjectId}
              onClose={() => setShowForm(false)}
              onSuccess={handleGoalCreated}
            />
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
                    subjectId={subjectId} 
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
    const data = {
      date,
      skills_module: module,
      lesson_summary: lesson,
      self_assessment: difficultyLevel,
      difficulties_faced: difficulties,
      improvement_plan: plan,
      problem_solved: solved === 'Yes' ? 1 : 0, // Chuyển thành 1/0 để phù hợp với ShowInClassForm
      subject_id: subjectId
    };

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
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Saved entry:', result);
      alert('Saved successfully!');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry.');
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
const SelfStudyFormModal = ({ subjectId, onClose, onSuccess }) => {
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
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      goal_id: null, // Không cần goal_id khi tạo mới
      class_name: formData.module,
      date: today,
      lesson: formData.lesson,
      time: formData.time,
      resources: formData.resources,
      activities: formData.activities,
      concentration: formData.concentration,
      plan_follow: formData.planFollow,
      evaluation: formData.evaluation,
      reinforcing: formData.reinforcing,
      subject_id: null,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/self-study-plans', payload);
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
          <select
            id="module"
            name="module"
            value={formData.module}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose a module --</option>
            <option value="IT English">IT English</option>
            <option value="Communication Skills">Communication Skills</option>
            <option value="Time Management">Time Management</option>
          </select>
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
