import React, { useState } from 'react';
import axios from 'axios';

const GoalForm = ({ studentId, subjectId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: 'semester', // Default changed to semester to match the API
    start_date: '',
    end_date: '',
    status: 'not_started',
    priority: 'high', // Default changed to high
    is_private: false,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

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

    if (!formData.start_date || !formData.end_date) {
      setFormError('Please enter start and end dates.');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setFormError('The end date must be on or after the start date.');
      return;
    }

    try {
      setFormLoading(true);
      // Use API_BASE from services
      const API_BASE = 'http://127.0.0.1:8000/api';
      const url = `${API_BASE}/student/${studentId}/subject/${subjectId}/goals`;

      // Ensure the payload data is in the correct format
      const payload = {
        title: formData.title,
        description: formData.description,
        goal_type: formData.goal_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        priority: formData.priority,
        is_private: formData.is_private
      };

      console.log('Sending data to API:', {
        url,
        data: payload
      });

      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API response:', response);

      setFormSuccess('Goal created successfully!');
      onSuccess();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error('Error creating goal:', err);

      // Display detailed error information for debugging
      if (err.response) {
        // Error from server with response
        console.error('Error response:', {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers
        });
        setFormError(`Error (${err.response.status}): ${err.response.data?.message || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // Error without response
        console.error('Error request:', err.request);
        setFormError('No response received from the server. Please check your network connection.');
      } else {
        // Other errors
        setFormError(`Error: ${err.message}`);
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={formWrapperStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>Create Goal</h2>
          <button onClick={onClose} style={closeBtnStyle}>&times;</button>
        </div>

        {formError && <div style={errorStyle}>{formError}</div>}
        {formSuccess && <div style={successStyle}>{formSuccess}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
          </div>

          <div style={grid2Cols}>
            <div>
              <label style={labelStyle}>Goal Type *</label>
              <select name="goal_type" value={formData.goal_type} onChange={handleChange} style={inputStyle}>
                <option value="semester">Semester</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority Level *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} style={inputStyle}>
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
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>End Date *</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} style={inputStyle} required />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="is_private" 
              name="is_private" 
              checked={formData.is_private} 
              onChange={handleChange} 
              style={{ width: '20px', height: '20px' }} 
            />
            <label htmlFor="is_private" style={{ cursor: 'pointer' }}>Private (only you can see it)</label>
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

// Styles
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
