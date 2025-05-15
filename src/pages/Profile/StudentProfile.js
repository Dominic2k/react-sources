import React, { useEffect, useState } from 'react';
import { Sidebar, Header } from '../../components/layout';
import EditModal from './EditModal';
import './StudentProfile.css';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Lấy userId từ localStorage
  const id = localStorage.getItem('userId') || 2;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Thêm timeout để tránh treo UI nếu server không phản hồi
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(`http://localhost:8000/api/students/${id}/profile`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.success && data.data.user) {
        const user = data.data.user;
        const student = user.student;

        setProfileData({
          id: user.id,
          name: user.full_name,
          username: user.username,
          email: user.email,
          profileImageUrl: user.avatar_url || 'http://example.com/default-avatar.jpg',
          studentId: student.student_code,
          admissionDate: student.admission_date,
          currentSemester: student.current_semester,
          dob: user.birthday,
          role: user.role || 'student',
          lastLogin: user.last_login,
        });
      } else {
        setError('Invalid data format received from server');
        console.warn('Invalid data format:', data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check if the server is running.');
      } else if (!navigator.onLine) {
        setError('You are offline. Please check your internet connection.');
      } else {
        setError(`Error connecting to server: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleSave = async () => {
    await fetchProfile();
    setIsModalOpen(false);
  };

  if (loading) return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-loading">Loading profile data...</div>
    </div>
  );

  if (error) return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-error">{error}</div>
    </div>
  );

  if (!profileData) return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-error">No profile data available</div>
    </div>
  );

  return (
    <div className="profile-container">
      <Sidebar />

      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h1>Welcome, {profileData.name}</h1>
            <p className="date">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="search-section">
            <input type="text" placeholder="Search" className="search-input" />
            <div className="sidebar-avatar-img">
              {profileData.profileImageUrl ? (
                <img src={profileData.profileImageUrl} alt="User avatar" className="top-avatar" />
              ) : (
                <span role="img" aria-label="avatar">👩‍🎓</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-top">
          <div className="profile-info">
            <div className="sidebar-avatar-img">
              {profileData.profileImageUrl ? (
                <img src={profileData.profileImageUrl} alt="User avatar" className="profile-avatar" />
              ) : (
                <span role="img" aria-label="avatar">👩‍🎓</span>
              )}
            </div>
            <div>
              <h2>{profileData.name}</h2>
              <p>{profileData.email}</p>
            </div>
          </div>
          <button className="edit-btn" onClick={() => setIsModalOpen(true)}>Edit</button>
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
          id={id}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default StudentProfile;
