import React, { useState, useEffect } from 'react';

const GoalForm = ({ class_subject_id, onClose, onSuccess, goal }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: 'semester',
    startDate: '',
    endDate: '',
    priority: 'high',
    isPrivate: false,
    status: 'not_started'
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        goalType: goal.goal_type || 'semester',
        startDate: goal.start_date?.slice(0, 10) || '',
        endDate: goal.end_date?.slice(0, 10) || '',
        priority: goal.priority || 'high',
        isPrivate: goal.is_private || false,
        status: goal.status || 'not_started'
      });
    }
  }, [goal]);

  useEffect(() => {
    console.log('LocalStorage values:');
    console.log('token:', localStorage.getItem('token'));
    console.log('user_id:', localStorage.getItem('user_id'));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.title.trim()) {
      setFormError('Please enter a title.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError('Please enter both start and end dates.');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError('End date must be after or equal to start date.');
      return;
    }

    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      if (!token) {
        setFormError('Please log in.');
        return;
      }
      if (!userId) {
        setFormError('User information not found. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
        return;
      }

      const requestData = {
        title: formData.title,
        description: formData.description,
        goal_type: formData.goalType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        priority: formData.priority,
        is_private: formData.isPrivate,
        status: formData.status
      };

      let response;
      if (goal && goal.id) {
        response = await fetch(`http://127.0.0.1:8000/api/student/goals/${goal.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(requestData)
        });
      } else {
        response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${class_subject_id}/goals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ ...requestData, class_subject_id, student_id: userId })
        });
      }

      const data = await response.json();

      if (!response.ok) {
        console.error('API error:', data, 'Status:', response.status);
        setFormError(data.message || 'An error occurred.');
        return;
      }

      setFormSuccess(goal ? 'Goal updated successfully!' : 'Goal created successfully!');
      onSuccess();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setFormError('An error occurred. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={formWrapperStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>{goal ? 'Edit Goal' : 'Create New Goal'}</h2>
          <button onClick={onClose} style={closeBtnStyle}>&times;</button>
        </div>
       

        {formError && <div style={errorStyle}>{formError}</div>}
        {formSuccess && <div style={successStyle}>{formSuccess}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              style={{ ...inputStyle, minHeight: '80px' }} 
            />
          </div>

          <div style={grid2Cols}>
            <div>
              <label style={labelStyle}>Goal Type *</label>
              <select 
                name="goalType" 
                value={formData.goalType} 
                onChange={handleChange} 
                style={inputStyle}
                required
              >
                <option value="semester">Semester</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority *</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                style={inputStyle}
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div style={grid2Cols}>
            <div>
              <label style={labelStyle}>Start Date *</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>
            <div>
              <label style={labelStyle}>End Date *</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="isPrivate" 
              name="isPrivate" 
              checked={formData.isPrivate} 
              onChange={handleChange} 
              style={{ width: '20px', height: '20px' }} 
            />
            <label htmlFor="isPrivate" style={{ cursor: 'pointer' }}>
              Private (only visible to you)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={formLoading} style={submitBtnStyle}>
              {formLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;

// Styles (unchanged)
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const formWrapperStyle = {
  background: '#fff', borderRadius: '10px', padding: '30px',
  width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
};

const headerStyle = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', marginBottom: '24px'
};

const closeBtnStyle = {
  background: 'none', border: 'none', fontSize: '24px',
  cursor: 'pointer', color: '#666'
};

const labelStyle = {
  display: 'block', marginBottom: '6px',
  fontSize: '14px', fontWeight: '500', color: '#444'
};

const inputStyle = {
  width: '100%', padding: '10px 12px',
  borderRadius: '6px', border: '1px solid #ddd',
  fontSize: '16px', boxSizing: 'border-box'
};

const grid2Cols = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
};

const cancelBtnStyle = {
  padding: '10px 18px', borderRadius: '6px',
  border: '1px solid #ddd', background: '#fff',
  color: '#444', fontSize: '16px', cursor: 'pointer'
};

const submitBtnStyle = {
  padding: '10px 18px', borderRadius: '6px', border: 'none',
  background: '#2196F3', color: '#fff', fontSize: '16px',
  cursor: 'pointer'
};

const errorStyle = {
  color: '#fff', background: '#F44336',
  padding: '10px 14px', borderRadius: '6px', marginBottom: '16px'
};

const successStyle = {  
  color: '#fff', background: '#4CAF50',
  padding: '10px 14px', borderRadius: '6px', marginBottom: '16px'
};
