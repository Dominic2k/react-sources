import React, { useState, useEffect } from 'react';
import './StudentProfile.css';

const EditModal = ({ data, onClose, onSave }) => {
  // Map API fields to modal fields
  const mapDataToFields = (data) => ({
    name: data?.name || data?.full_name || '',
    email: data?.email || '',
    studentId: data?.studentId || data?.student_code || '',
    admissionDate: data?.admissionDate || data?.admission_date || '',
    currentSemester: data?.currentSemester || data?.current_semester || '',
  });

  const [editedData, setEditedData] = useState(mapDataToFields(data));

  useEffect(() => {
    setEditedData(mapDataToFields(data));
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

      // const token = localStorage.getItem('token');
      // if (!token) {
      //   throw new Error('No token found');
      // }
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
        <h2>Edit Profile</h2>
        <form className="edit-modal-form">
          {fields.map(field => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.name === 'admissionDate' ? 'date' : 'text'}
                id={field.name}
                name={field.name}
                value={editedData[field.name] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="button-group">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="save-btn" onClick={handleSubmit}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
