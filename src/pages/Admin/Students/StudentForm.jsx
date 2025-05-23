import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import './StudentForm.css';
import axios from 'axios';

const StudentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [classes, setClasses] = useState([]);
  
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        student_code: '',
        class_id: '',
        phone: '',
        gender: 'male',
        birthday: '',
        admission_date: '',
        current_semester: '1',
        last_login: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchClasses();
        if (id) {
            fetchStudentData();
        }
    }, [id]);

    const fetchClasses = async () => {
    try {
        const token = localStorage.getItem('token');
    //   console.log('Fetching classes with token:', token);
        const response = await axios.get('http://localhost:8000/api/admin/classes', {
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });
        // console.log('Classes response:', response.data);

        if (response.data && response.data.data) {
            setClasses(response.data.data);
        } else if (Array.isArray(response.data)) {
            setClasses(response.data);
        } else {
            setClasses([]);
        }
        } catch (err) {
            console.error('Error fetching classes:', err);
            setError('Failed to load classes. Please try again later.');
        }
    };

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/admin/students/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

        // console.log('Student data response:', response.data);

            if (response.data && response.data.data) {
                const student = response.data.data;
                setFormData({
                    full_name: student.user?.full_name || '',
                    email: student.user?.email || '',
                    password: '',
                    password_confirmation: '',
                    student_code: student.student_code || '',
                    class_id: student.class_id || '',
                    phone: student.user?.phone || '',
                    gender: student.user?.gender || 'male',
                    birthday: student.user?.birthday ? student.user.birthday.split('T')[0] : '',
                    last_login: student.user?.last_login ? student.user.last_login.split('T')[0] : new Date().toISOString().split('T')[0],
                    admission_date: student.admission_date ? student.admission_date.split('T')[0] : '',
                    current_semester: student.current_semester?.toString() || '1',
                });
            }
            setLoading(false);
        } catch (err) {
            // console.error('Error fetching student data:', err);
            setError('Failed to load student data. Please try again later.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
    // Validate form
        if (!formData.full_name || !formData.email || !formData.student_code || !formData.class_id) {
            setError('Please fill in all required fields.');
            return;
        }
    
    // Validate password for new student
        if (!id && (!formData.password || formData.password !== formData.password_confirmation)) {
            setError('Passwords do not match or are empty.');
            return;
        }
    
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
      
      // Prepare data for API
            const apiData = { ...formData };
      
      // If editing and password is empty, remove password fields
            if (id && !apiData.password) {
                delete apiData.password;
                delete apiData.password_confirmation;
            }
      
      // For new users, ensure last_login is in the correct format
            if (!id) {
                // Make sure it's a valid ISO string with timezone
                const now = new Date();
                apiData.last_login = now.toISOString();
                // console.log('Setting last_login for new user:', apiData.last_login);
            }
      
      // Ensure birthday is in ISO format
            if (apiData.birthday) {
                // If birthday only has date part (YYYY-MM-DD), add time part
                if (!apiData.birthday.includes('T')) {
                apiData.birthday = `${apiData.birthday}T00:00:00.000Z`;
                }
            }
      
            console.log('Submitting data:', apiData);
      
            if (id) {
                // Update existing student
                await axios.put(`http://localhost:8000/api/admin/students/${id}`, apiData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            } else {
            // Create new student
                await axios.post('http://localhost:8000/api/admin/students', apiData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }   
                });
            }
      
      // Redirect to student list
            navigate('/admin/students');
        } catch (err) {
            console.error('Error saving student:', err);
            if (err.response && err.response.data) {
                console.error('Error response:', err.response.data);
                setError(err.response.data.message || 'Failed to save student. Please try again later.');
            } else {
                setError('Failed to save student. Please try again later.');
            }
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/students');
    };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <div className="admin-header-left">
            <button className="back-button" onClick={handleCancel}>
              <span>←</span>
            </button>
            <h2>{id ? 'Edit Student' : 'Add New Student'}</h2>
          </div>
        </div>

        <div className="admin-main">
          <div className="student-form-container">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <form onSubmit={handleSubmit} className="student-form">
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="full_name">Full Name *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password {!id && '*'}</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!id}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password_confirmation">Confirm Password {!id && '*'}</label>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required={!id}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="student_code">Student Code *</label>
                    <input
                      type="text"
                      id="student_code"
                      name="student_code"
                      value={formData.student_code}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="class_id">Class *</label>
                    <select
                      id="class_id"
                      name="class_id"
                      value={formData.class_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.class_name || cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="admission_date">Admission Date</label>
                    <input
                      type="date"
                      id="admission_date"
                      name="admission_date"
                      value={formData.admission_date}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="current_semester">Current Semester</label>
                    <select
                      id="current_semester"
                      name="current_semester"
                      value={formData.current_semester}
                      onChange={handleChange}
                    >
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                      <option value="3">Semester 3</option>
                      <option value="4">Semester 4</option>
                      <option value="5">Semester 5</option>
                      <option value="6">Semester 6</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="birthday">Birthday</label>
                    <input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;



