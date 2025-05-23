import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import './StudentList.css';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Using token:', token);
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:8000/api/admin/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.data) {
        setStudents(response.data.data);
      } else if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        if (err.response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(`Failed to load students: ${err.response.data.message || 'Unknown error'}`);
        }
      } else {
        setError('Failed to load students. Please try again later.');
      }
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate('/admin/students/create');
  };

  const handleEdit = (id) => {
    navigate(`/admin/students/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/admin/students/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        // Refresh the list
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Failed to delete student. Please try again later.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student => {
    const fullName = student.user?.full_name || '';
    const email = student.user?.email || '';
    const studentCode = student.student_code || '';
    
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           studentCode.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
            <div className="admin-header">
                <div className="admin-header-left">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <span>←</span>
                    </button>
                    <div className="search-container">
                        <input type="text" placeholder="Search" className="search-input" value={searchTerm} onChange={handleSearch} />
                    </div>
                </div>
                <div className="admin-header-right">
                    <div className="notification-icon">
                        <span>🔔</span>
                    </div>
                    <div className="admin-avatar">
                        <img src="https://media.istockphoto.com/id/1386179512/photo/computer-hacker-stealing-data-from-a-laptop.jpg?s=612x612&w=0&k=20&c=uaPBMvpmnqgulWYWnHqgEqec3OWwwCjv7k9D_VAeDV0=" alt="Admin" />
                    </div>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-title-container">
                    <h1 className="admin-title">Students</h1>
                    <div className="admin-actions">
                    <button className="add-new-button" onClick={handleAddNew}>
                        Add New <span>+</span>
                    </button>
                    <select className="filter-select">
                        <option>All Classes</option>
                        {/* Add class options here */}
                    </select>
                    </div>
                </div>
                <div className="admin-subtitle">All Students List</div>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                    <div className="student-table-container">
                        <table className="student-table">
                        <thead>
                            <tr>
                            <th>No</th>
                            <th>Students</th>
                            <th>Code</th>
                            <th>Email</th>
                            <th>Admission Date</th>
                            <th>Current Semester</th>
                            <th>Birthday</th>
                            <th>Last Login</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                                <tr key={student.user_id || index}>
                                <td>{index + 1}</td>
                                <td>{student.user?.full_name || 'N/A'}</td>
                                <td>{student.student_code || 'N/A'}</td>
                                <td>{student.user?.email || 'N/A'}</td>
                                <td>{student.admission_date || 'N/A'}</td>
                                <td>{student.current_semester || 'N/A'}</td>
                                <td>{student.user?.birthday ? new Date(student.user.birthday).toLocaleDateString() : 'N/A'}</td>
                                <td>{student.user?.last_login ? new Date(student.user.last_login).toLocaleDateString() : 'N/A'}</td>
                                <td className="action-buttons">
                                    <button 
                                    className="edit-button" 
                                    onClick={() => handleEdit(student.user_id)}
                                    >
                                    ✏️
                                    </button>
                                    <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(student.user_id)}
                                    >
                                    🗑️
                                    </button>
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="9" className="no-data">No students found</td>
                            </tr>
                            )}
                    </tbody>
                    </table>
                </div>
                </>
            )}
            </div>
        </div>
    </div>
  );
};

export default StudentList;


