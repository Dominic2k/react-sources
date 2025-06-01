import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Header } from '../../../components/layout';
import './ClassSubjectAssignment.css';

function ClassSubjectAssignment() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        class_id: '',
        subject_id: '',
        teacher_id: '',
        students: [],
        schedule_info: '',
        room: '',
        status: 'active'
    });

    const [data, setData] = useState({
        classes: [],
        subjects: [],
        teachers: [],
        students: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssignmentData();
    }, []);

    const fetchAssignmentData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            const response = await axios.get('http://localhost:8000/api/admin/class-subjects/assignment-data', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', response);
            console.log('Response data:', response.data);

            if (response.data.success) {
                setData(response.data.data);
                setError('');
            } else {
                setError('Failed to fetch data. Please try again.');
            }
        } catch (err) {
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                status: err.response?.status,
                data: err.response?.data
            });
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'class_id') {
            const selectedClassData = data.classes.find(c => c.id === parseInt(value));
            setSelectedClass(selectedClassData);
        }
    };

    const handleStudentSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            students: selectedOptions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/admin/class-subjects/assign', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setSuccess('Assignment created successfully!');
                setFormData({
                    class_id: '',
                    subject_id: '',
                    teacher_id: '',
                    students: [],
                    schedule_info: '',
                    room: '',
                    status: 'active'
                });
                setSelectedClass(null);
                fetchAssignmentData();
            } else {
                setError('Failed to create assignment. Please try again.');
            }
        } catch (err) {
            setError('Failed to create assignment. Please try again.');
            console.error('Error creating assignment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

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
                        <h1 className="admin-title">Class Subject Assignment</h1>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit} className="assignment-form">
                        <div className="form-group">
                            <label htmlFor="class_id">Class:</label>
                            <select
                                id="class_id"
                                name="class_id"
                                value={formData.class_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a class</option>
                                {data.classes.map(classItem => (
                                    <option key={classItem.id} value={classItem.id}>
                                        {classItem.class_name}
                                    </option>
                                ))}
                            </select>
                            {selectedClass && (
                                <div className="class-info">
                                    <p>Class: {selectedClass.class_name}</p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject_id">Subject:</label>
                            <select
                                id="subject_id"
                                name="subject_id"
                                value={formData.subject_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a subject</option>
                                {data.subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.subject_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="teacher_id">Teacher:</label>
                            <select
                                id="teacher_id"
                                name="teacher_id"
                                value={formData.teacher_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a teacher</option>
                                {data.teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="schedule_info">Schedule Information:</label>
                            <input
                                type="text"
                                id="schedule_info"
                                name="schedule_info"
                                value={formData.schedule_info}
                                onChange={handleInputChange}
                                placeholder="e.g., Monday 8:00-10:00"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="room">Room:</label>
                            <input
                                type="text"
                                id="room"
                                name="room"
                                value={formData.room}
                                onChange={handleInputChange}
                                placeholder="e.g., Room 101"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="students">Students:</label>
                            <select
                                id="students"
                                name="students"
                                multiple
                                value={formData.students}
                                onChange={handleStudentSelection}
                                required
                                className="students-select"
                            >
                                {data.students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} - {student.student_code}
                                    </option>
                                ))}
                            </select>
                            <small>Hold Ctrl/Cmd to select multiple students</small>
                        </div>

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClassSubjectAssignment; 