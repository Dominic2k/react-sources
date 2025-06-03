import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import './Subjects.css';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        subject_name: '',
        description: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/admin/subjects', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch subjects');
            }

            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                setSubjects(result.data);
            } else {
                setSubjects([]);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Validate required fields
        if (!formData.subject_name) {
            setError('Please fill in the subject name.');
            return;
        }

        try {
            const url = isEditing 
                ? `http://localhost:8000/api/admin/subjects/${editingId}`
                : 'http://localhost:8000/api/admin/subjects';
            
            const method = isEditing ? 'PUT' : 'POST';

            // Prepare data for API
            const apiData = { ...formData };
            
            console.log('Submitting subject data:', apiData);

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save subject');
            }

            // Reset form and refresh data
            setFormData({ 
                subject_name: '',
                description: ''
            });
            setIsEditing(false);
            setEditingId(null);
            setShowForm(false);
            fetchSubjects();
        } catch (err) {
            console.error('Error saving subject:', err);
            setError(err.message || 'Failed to save subject. Please try again later.');
        }
    };

    const handleEdit = (subject) => {
        setFormData({
            subject_name: subject.subject_name || '',
            description: subject.description || ''
        });
        setIsEditing(true);
        setEditingId(subject.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/admin/subjects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete subject');
            }

            fetchSubjects();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddNew = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ 
            subject_name: '',
            description: ''
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ 
            subject_name: '',
            description: ''
        });
        setShowForm(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredSubjects = subjects.filter(subject => {
        const subjectName = subject.subject_name || '';
        return subjectName.toLowerCase().includes(searchTerm.toLowerCase());
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
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className="search-input" 
                                value={searchTerm} 
                                onChange={handleSearch} 
                            />
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
                        <h1 className="admin-title">Subjects</h1>
                        <div className="admin-actions">
                            <button className="add-new-button" onClick={handleAddNew}>
                                Add New <span>+</span>
                            </button>
                        </div>
                    </div>

                    {showForm && (
                        <div className="subject-form-container">
                            <form onSubmit={handleSubmit} className="subject-form">
                                <h2>{isEditing ? 'Edit Subject' : 'Add New Subject'}</h2>
                                {error && <div className="error-message">{error}</div>}
                                <div className="form-group">
                                    <label>Subject Name *:</label>
                                    <input
                                        type="text"
                                        value={formData.subject_name}
                                        onChange={(e) => setFormData({...formData, subject_name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="submit-button">
                                        {isEditing ? 'Update' : 'Add'} Subject
                                    </button>
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {!showForm && (
                        <>
                            {loading ? (
                                <div className="loading">Loading...</div>
                            ) : error ? (
                                <div className="error-message">{error}</div>
                            ) : (
                                <div className="subjects-list">
                                    <h2>Subjects List</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Subject Name</th>
                                                <th>Description</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSubjects.map((subject) => (
                                                <tr key={subject.id}>
                                                    <td>{subject.subject_name}</td>
                                                    <td>{subject.description}</td>
                                                    <td>
                                                        <button onClick={() => handleEdit(subject)} className="edit-button">Edit</button>
                                                        <button onClick={() => handleDelete(subject.id)} className="delete-button">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Subjects; 