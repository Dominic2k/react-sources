
import React, { useEffect, useState } from 'react';
import EditModal from './EditModal';
import './StudentProfile.css';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    profileImageUrl: '',
    studentId: '',
    admissionDate: '',
    currentSemester: 0,
    dob: '',
    role: '',
    lastLogin: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/students/1/profile')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data.user) {
          const user = data.data.user;
          const student = user.student;

          setProfileData({
            name: user.full_name,
            username: user.username,
            email: user.email,
            profileImageUrl: user.avatar_url || 'http://example.com/default-avatar.jpg',
            studentId: student.student_code,
            admissionDate: student.admission_date,
            currentSemester: student.current_semester,
            dob: user.birthday,
            role: user.role || 'student',
            lastLogin: user.last_login
          });
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSave = (updatedData) => {
    setProfileData(updatedData);
    setIsModalOpen(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h1>Welcome, {profileData.name}</h1>
          <p className="date">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="search-section">
          <input type="text" placeholder="Search" className="search-input" />
          <img
            src={profileData.profileImageUrl}
            alt="avatar"
            className="top-avatar"
          />
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-info">
            <img
              src={profileData.profileImageUrl}
              alt="profile avatar"
              className="profile-avatar"
            />
            <div>
              <h2>{profileData.name}</h2>
              <p>{profileData.email}</p>
            </div>
          </div>
          <button className="edit-btn" onClick={() => setIsModalOpen(true)}>
            Edit
          </button>
        </div>

        <div className="profile-details">
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Role:</strong> {profileData.role}</p>
          <p><strong>Student ID:</strong> {profileData.studentId}</p>
          <p><strong>Admission Date:</strong> {profileData.admissionDate}</p>
          <p><strong>Current Semester:</strong> {profileData.currentSemester}</p>
          <p><strong>Date of Birth:</strong> {profileData.dob}</p>
          <p><strong>Last Login:</strong> {profileData.lastLogin}</p>
        </div>
      </div>

      {isModalOpen && (
        <EditModal
          data={profileData}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default StudentProfile;