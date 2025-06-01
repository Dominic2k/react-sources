import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import './Teachers.css';

function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        specialization: '',
        bio: '',
        birthday: '',
        join_date: '',
        role: 'teacher'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/admin/teachers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch teachers');
            }

            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                setTeachers(result.data);
            } else {
                setTeachers([]);
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

        if (!formData.full_name || !formData.email || (!isEditing && !formData.password)) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const url = isEditing 
                ? `http://localhost:8000/api/admin/teachers/${editingId}`
                : 'http://localhost:8000/api/admin/teachers';
            
            const method = isEditing ? 'PUT' : 'POST';

            const apiData = { ...formData };
            
            if (!isEditing) {
                apiData.role = "teacher";
            }

            if (isEditing && !apiData.password) {
                delete apiData.password;
            }

            if (apiData.birthday && !apiData.birthday.includes('T')) {
                apiData.birthday = `${apiData.birthday}T00:00:00.000Z`;
            }
            if (apiData.join_date && !apiData.join_date.includes('T')) {
                apiData.join_date = `${apiData.join_date}T00:00:00.000Z`;
            }

            console.log('Submitting teacher data:', apiData);

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
                throw new Error(result.message || 'Failed to save teacher');
            }

            setFormData({ 
                full_name: '', 
                email: '', 
                password: '', 
                specialization: '', 
                bio: '', 
                birthday: '', 
                join_date: '',
                role: 'teacher'
            });
            setIsEditing(false);
            setEditingId(null);
            setShowForm(false);
            fetchTeachers();
        } catch (err) {
            console.error('Error saving teacher:', err);
            setError(err.message || 'Failed to save teacher. Please try again later.');
        }
    };

    const handleEdit = (teacher) => {
        setFormData({
            full_name: teacher.user.full_name,
            email: teacher.user.email,
            password: '',
            specialization: teacher.specialization || '',
            bio: teacher.bio || '',
            birthday: teacher.user.birthday ? teacher.user.birthday.split('T')[0] : '',
            join_date: teacher.join_date ? teacher.join_date.split('T')[0] : '',
            role: teacher.user.role || 'teacher'
        });
        setIsEditing(true);
        setEditingId(teacher.user_id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/admin/teachers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete teacher');
            }

            fetchTeachers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddNew = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ full_name: '', email: '', password: '', specialization: '', bio: '', birthday: '', join_date: '', role: 'teacher' });
        setShowForm(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ full_name: '', email: '', password: '', specialization: '', bio: '', birthday: '', join_date: '', role: 'teacher' });
        setShowForm(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTeachers = teachers.filter(teacher => {
        const fullName = teacher.user?.full_name || '';
        const email = teacher.user?.email || '';
        const specialization = teacher.specialization || '';
        
        return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               specialization.toLowerCase().includes(searchTerm.toLowerCase());
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
                        <h1 className="admin-title">Teachers</h1>
                        <div className="admin-actions">
                            <button className="add-new-button" onClick={handleAddNew}>
                                Add New <span>+</span>
                            </button>
                        </div>
                    </div>

                    {showForm && (
                        <div className="teacher-form-container">
                            <form onSubmit={handleSubmit} className="teacher-form">
                                <h2>{isEditing ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                                <div className="form-group">
                                    <label>Full Name:</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Birthday:</label>
                                    <input
                                        type="date"
                                        value={formData.birthday}
                                        onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                                        required={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Specialization:</label>
                                    <input
                                        type="text"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bio:</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Join date:</label>
                                    <input
                                        type="date"
                                        value={formData.join_date}
                                        onChange={(e) => setFormData({...formData, join_date: e.target.value})}
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="submit-button">
                                        {isEditing ? 'Update' : 'Add'} Teacher
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
                                <div className="teachers-list">
                                    <h2>Teachers List</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Specialization</th>
                                                <th>Join Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTeachers.map((teacher) => (
                                                <tr key={teacher.user_id}>
                                                    <td>{teacher.user.full_name}</td>
                                                    <td>{teacher.user.email}</td>
                                                    <td>{teacher.specialization}</td>
                                                    <td>{teacher.join_date}</td>
                                                    <td>
                                                        <button onClick={() => handleEdit(teacher)} className="edit-button">Edit</button>
                                                        <button onClick={() => handleDelete(teacher.user_id)} className="delete-button">Delete</button>
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

export default Teachers; 