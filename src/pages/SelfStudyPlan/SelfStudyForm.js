import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SelfStudyForm.css';

function SelfStudyForm() {
  const [date, setDate] = useState('');
  const [module, setModule] = useState('IT English');
  const [lesson, setLesson] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [plan, setPlan] = useState('');
  const [solved, setSolved] = useState('Yes');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const subjectId = queryParams.get('subjectId');
  const planId = queryParams.get('id');

  useEffect(() => {
    if (planId) {
      fetchPlanDetails();
    }
  }, [planId]);

  const fetchPlanDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/student/subject/${subjectId}/self-study-plans/${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plan details');
      }

      const data = await response.json();
      setDate(data.date);
      setModule(data.skills_module);
      setLesson(data.lesson_summary);
      setDifficultyLevel(data.self_assessment);
      setDifficulties(data.difficulties_faced);
      setPlan(data.improvement_plan);
      setSolved(data.problem_solved ? 'Yes' : 'Not Yet');
      setNotes(data.additional_notes);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDate('');
    setModule('IT English');
    setLesson('');
    setDifficultyLevel('');
    setDifficulties('');
    setPlan('');
    setSolved('Yes');
    setNotes('');
    setError(null);
  };

  const handleSave = async () => {
    if (!date || !difficultyLevel || !lesson) {
      setError('Please fill all required fields.');
      return;
    }

    const data = {
      date,
      skills_module: module,
      lesson_summary: lesson,
      self_assessment: difficultyLevel,
      difficulties_faced: difficulties,
      improvement_plan: plan,
      problem_solved: solved === 'Yes',
      additional_notes: notes,
    };

    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const url = planId 
        ? `http://127.0.0.1:8000/api/student/subject/${subjectId}/self-study-plans/${planId}`
        : `http://127.0.0.1:8000/api/student/subject/${subjectId}/self-study-plans`;
      
      const response = await fetch(url, {
        method: planId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      alert(planId ? 'Updated successfully!' : 'Saved successfully!');
      navigate(`/subject/${subjectId}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!planId) return;

    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/student/subject/${subjectId}/self-study-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      alert('Deleted successfully!');
      navigate(`/subject/${subjectId}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="student-journal-container">
      <h2 className="title">{planId ? 'EDIT SELF-STUDY PLAN' : 'SELF-STUDY PLAN'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="journal-form">
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
          <label>My lesson - What did I learn?</label>
          <input type="text" value={lesson} onChange={(e) => setLesson(e.target.value)} />
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
          <input type="text" value={difficulties} onChange={(e) => setDifficulties(e.target.value)} />
        </div>

        <div className="form-group">
          <label>My plan</label>
          <input type="text" value={plan} onChange={(e) => setPlan(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Problem solved</label>
          <select value={solved} onChange={(e) => setSolved(e.target.value)}>
            <option>Yes</option>
            <option>Not Yet</option>
          </select>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="button-group">
          <button type="button" onClick={handleSave} className="save-button" disabled={isLoading}>
            {planId ? 'Update' : 'Save'}
          </button>
          <button type="button" onClick={handleReset} className="reset-button" disabled={isLoading}>
            Reset
          </button>
          {planId && (
            <button type="button" onClick={handleDelete} className="delete-button" disabled={isLoading}>
              Delete
            </button>
          )}
          {subjectId && (
            <button type="button" onClick={() => navigate(`/subject/${subjectId}`)} className="back-button" disabled={isLoading}>
              Back to Subject
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default SelfStudyForm; 