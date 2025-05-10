import React, { useState, useEffect } from 'react';
import './StudentProfile.css';
const EditModal = ({ data, onClose, onSave }) => {
  const [editedData, setEditedData] = useState({ ...data });

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/students/1/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const result = await response.json();
      onSave(editedData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("There was an error updating the profile. Please try again.");
    }
  };

  const fields = [
    { label: 'Name', name: 'name' },
    { label: 'Email', name: 'email' },
    { label: 'Username', name: 'username' },
    { label: 'Student ID', name: 'studentId' },
    { label: 'Admission Date', name: 'admissionDate' },
    { label: 'Current Semester', name: 'currentSemester' },
    { label: 'Date of Birth', name: 'dob' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Edit Profile</h2>

        {fields.map(field => (
          <div className="form-group" key={field.name}>
            <label>{field.label}:</label>
            <input
              type="text"
              name={field.name}
              value={editedData[field.name] || ''}
              onChange={handleChange}
            />
          </div>
        ))}

        <button className="save-btn" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default EditModal;
