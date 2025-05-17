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
    const payload = {
      full_name: editedData.name,
      email: editedData.email,
      student_code: editedData.studentId,
      admission_date: editedData.admissionDate,
      current_semester: parseInt(editedData.currentSemester, 10),
    };

    try {
      const response = await fetch('http://localhost:8000/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const result = await response.json();
      onSave(result.data);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("There was an error updating the profile. Please try again.");
    }
  };

  const fields = [
    { label: 'Name', name: 'name' },
    { label: 'Email', name: 'email' },
    { label: 'Student ID', name: 'studentId' },
    { label: 'Admission Date', name: 'admissionDate' },
    { label: 'Current Semester', name: 'currentSemester' },
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
