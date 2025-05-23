import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import './ClassForm.css';
import axios from 'axios';

const ClassForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const [formData, setFormData] = useState({
        class_name: '',
        semester: '',
        start_date: '',
        end_date: '',
        status: 'planning'
    });

    useEffect(() => {
        if (id) {
        fetchClassData();
        }
    }, [id]);

    const fetchClassData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/admin/classes/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

            if (response.data && response.data.data) {
                const classData = response.data.data;
                setFormData({
                    class_name: classData.class_name || '',
                    semester: classData.semester || '',
                    start_date: classData.start_date ? classData.start_date.slice(0, 10) : '',
                    end_date: classData.end_date ? classData.end_date.slice(0, 10) : '',
                    status: classData.status || 'planning'
                });
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching class data:', err);
            setError('Failed to load class data. Please try again later.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
            setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.class_name) {
            setError('Class name is required.');
            return;
        }
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
        
            const apiData = { ...formData };
        
        // Format dates for API
            if (apiData.start_date && !apiData.start_date.includes('T')) {
                apiData.start_date = `${apiData.start_date}T00:00:00.000Z`;
            }
        
            if (apiData.end_date && !apiData.end_date.includes('T')) {
                apiData.end_date = `${apiData.end_date}T00:00:00.000Z`;
            }
        
            if (id) {
                // Update existing class
                await axios.put(`http://localhost:8000/api/admin/classes/${id}`, apiData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
                });
            } else {
                // Create new class
                await axios.post('http://localhost:8000/api/admin/classes', apiData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }   
                });
            }
        
        // Redirect to class list
            navigate('/admin/classes');
        } catch (err) {
            console.error('Error saving class:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Failed to save class. Please try again later.');
            } else {
                setError('Failed to save class. Please try again later.');
            }
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/classes');
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
                <h2>{id ? 'Edit Class' : 'Add New Class'}</h2>
            </div>
            </div>
            
            <div className="admin-main">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="class-form">
                <div className="form-section">
                    <div className="form-section-title">Class Information</div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="class_name">Class Name *</label>
                            <input type="text" id="class_name" name="class_name" value={formData.class_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="semester">Semester *</label>
                            <input type="text" id="semester" name="semester" value={formData.semester} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_date">Start Date</label>
                            <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end_date">End Date</label>
                            <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} >
                                <option value="planning">Planning</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
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
            </div>
        </div>
        </div>
    );
};

export default ClassForm;

