import React, { useEffect, useState } from 'react';
import { Sidebar, Header } from '../../components/layout';
import EditModal from './EditModal';
import axios from 'axios';
import './StudentProfile.css';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://127.0.0.1:8000/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // API trả về { success, data: { user: {...}, student: {...} } }
      if (response.data.success && response.data.data) {
        const { user, student } = response.data.data;
        setProfileData({
          username: user?.username || '',
          name: user?.full_name || '',
          email: user?.email || '',
          role: user?.role || '',
          dob: user?.birthday || '',
          lastLogin: user?.last_login || '',
          profileImageUrl: user?.avatar_url || '',
          studentId: student?.student_code || '',
          admissionDate: student?.admission_date || '',
          currentSemester: student?.current_semester || '',
        });
      } else {
        setError('Invalid data format received from server');
        console.warn('Invalid data format:', response.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
      } else {
        setError(`Error loading profile: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put('http://127.0.0.1:8000/api/student/profile', updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        await fetchProfile(); // Refresh profile data
        setIsModalOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Lấy danh sách self-study plans theo classSubjectId
  const fetchSelfStudyPlans = async (classSubjectId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${classSubjectId}/self-study-plans`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.data; // hoặc data.plans tùy theo backend trả về
  };

  if (loading) return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-main-content">
        <Header />
        <div className="profile-content-area">
          <div className="profile-loading">Loading profile data...</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-main-content">
        <Header />
        <div className="profile-content-area">
          <div className="profile-error">{error}</div>
        </div>
      </div>
    </div>
  );

  if (!profileData) return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-main-content">
        <Header />
        <div className="profile-content-area">
          <div className="profile-error">No profile data available</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-main-content">
        <Header />
        <div className="profile-content-area">
          <div className="profile-card">
            <div className="profile-header">
              <h1>Student Profile</h1>
              <button onClick={() => setIsModalOpen(true)} className="edit-button">
                Edit Profile
              </button>
            </div>

            <div className="profile-details">
              <p><strong>Username:</strong> {profileData.username}</p>
              <p><strong>Full Name:</strong> {profileData.name}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
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
      </div>
    </div>
  );
};

export default StudentProfile;
