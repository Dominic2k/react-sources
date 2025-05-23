import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import './ClassList.css';
import axios from 'axios';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:8000/api/admin/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.data) {
        setClasses(response.data.data);
      } else if (Array.isArray(response.data)) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching classes:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(`Failed to load classes: ${err.response.data.message || 'Unknown error'}`);
        }
      } else {
        setError('Failed to load classes. Please try again later.');
      }
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate('/admin/classes/create');
  };

  const handleEdit = (id) => {
    navigate(`/admin/classes/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/admin/classes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        // Refresh the list
        fetchClasses();
      } catch (err) {
        console.error('Error deleting class:', err);
        setError('Failed to delete class. Please try again later.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClasses = classes.filter(cls => {
    const className = cls.class_name || cls.name || '';
    
    return className.toLowerCase().includes(searchTerm.toLowerCase());
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
            <h1 className="admin-title">Classes</h1>
            <div className="admin-actions">
              <button className="add-new-button" onClick={handleAddNew}>
                Add New <span>+</span>
              </button>
            </div>
          </div>
          <div className="admin-subtitle">All Classes List</div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="class-table-container">
                <table className="class-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Class Name</th>
                      <th>Semester</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Students Count</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.length > 0 ? (
                      filteredClasses.map((cls, index) => (
                        <tr key={cls.id || index}>
                          <td>{index + 1}</td>
                          <td>{cls.class_name || cls.name || 'N/A'}</td>
                          <td>{cls.semester || 'N/A'}</td>
                          <td>{cls.start_date || 'N/A'}</td>
                          <td>{cls.end_date || 'N/A'}</td>
                          <td>{cls.students_count || 0}</td>
                          <td>
                            <span className={`status-badge status-${cls.status || 'active'}`}>
                              {cls.status ? cls.status.charAt(0).toUpperCase() + cls.status.slice(1) : 'Active'}
                            </span>
                          </td>
                          <td>{cls.created_at ? new Date(cls.created_at).toLocaleDateString() : 'N/A'}</td>
                          <td className="action-buttons">
                            <button 
                              className="edit-button" 
                              onClick={() => handleEdit(cls.id)}
                            >
                              ✏️
                            </button>
                            <button 
                              className="delete-button" 
                              onClick={() => handleDelete(cls.id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No classes found</td>
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

export default ClassList;