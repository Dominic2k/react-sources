import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Header } from '../../../components/layout';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import './ActivityLogs.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [activeTab, setActiveTab] = useState('logs');
    const logsPerPage = 10;
    const [dashboardData, setDashboardData] = useState({
        totalCounts: {
            students: 0,
            teachers: 0,
            classes: 0,
            subjects: 0
        },
        recentActivities: [],
        classDistribution: [],
        subjectDistribution: { total: 0 },
        enrollmentTrends: []
    });

    const [activityStats, setActivityStats] = useState({
        actionTypes: {},
        userPercentages: {},
        hourlyDistribution: Array(24).fill(0)
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchLogs();
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (logs.length > 0) {
            processLogsForCharts();
        }
    }, [logs]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch all statistics from the first endpoint
            const response = await fetch('http://localhost:8000/api/admin/dashboard/statistics', { headers });
            const result = await response.json();
            
            if (result.success) {
                const data = result.data;
                setDashboardData({
                    totalCounts: {
                        students: data.total_students,
                        teachers: data.total_teachers,
                        classes: data.total_classes,
                        subjects: data.total_subjects
                    }
                });
            }

            // Fetch enrollment trends separately
            const enrollmentTrendsResponse = await fetch('http://localhost:8000/api/admin/dashboard/student-enrollment-trends', { headers });
            const enrollmentTrendsData = await enrollmentTrendsResponse.json();
            
            if (enrollmentTrendsData.success) {
                setDashboardData(prev => ({
                    ...prev,
                    enrollmentTrends: enrollmentTrendsData.data
                }));
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    };

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/admin/activity-logs', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch activity logs');
            }

            const data = await response.json();
            setLogs(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        try {
            const isoString = dateString.replace(' ', 'T');
            const date = new Date(isoString);
            
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateString);
                return dateString;
            }

            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const processLogsForCharts = () => {
        const actionTypes = {};
        const userActivities = {};
        const hourlyDistribution = Array(24).fill(0);
        let totalActivities = 0;

        logs.forEach(log => {
            // Count action types
            actionTypes[log.action] = (actionTypes[log.action] || 0) + 1;
            
            // Count user activities
            userActivities[log.user_name] = (userActivities[log.user_name] || 0) + 1;
            totalActivities++;
            
            // Count hourly distribution
            const hour = new Date(log.time).getHours();
            hourlyDistribution[hour]++;
        });

        // Calculate percentages for user activities
        const userPercentages = {};
        Object.keys(userActivities).forEach(user => {
            userPercentages[user] = ((userActivities[user] / totalActivities) * 100).toFixed(1);
        });

        setActivityStats({
            actionTypes,
            userPercentages,
            hourlyDistribution
        });
    };

    const getActionChartData = () => ({
        labels: Object.keys(activityStats.actionTypes),
        datasets: [{
            label: 'Number of Actions',
            data: Object.values(activityStats.actionTypes),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    });

    const getUserChartData = () => ({
        labels: Object.keys(activityStats.userPercentages),
        datasets: [{
            data: Object.values(activityStats.userPercentages),
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    });

    const getHourlyChartData = () => ({
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [{
            label: 'Activities per Hour',
            data: activityStats.hourlyDistribution,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    });

    const filteredLogs = logs.filter(log => {
        const action = log.action || '';
        const entity = log.entity || '';
        const userName = log.user_name || '';
        const logDate = new Date(log.time).toLocaleDateString('vi-VN');
        const selectedDateObj = selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : null;
        
        const matchesSearch = action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            userName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDate = !selectedDate || logDate === selectedDateObj;   
        
        return matchesSearch && matchesDate;
    });

    // Calculate pagination
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="activity-logs-container">
            <AdminSidebar />
            <div className="main-content-activity-logs">
                <Header />
                <div className="activity-logs-content">
                    <div className="tabs">
                        <button 
                            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('logs')}
                        >
                            Activity Logs
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            Dashboard
                        </button>
                    </div>

                    {activeTab === 'logs' ? (
                        <>
                            <div className="search-filter-container">
                                <div className="search-container">
                                    <input 
                                        type="text" 
                                        placeholder="Search logs..." 
                                        className="search-input" 
                                        value={searchTerm} 
                                        onChange={handleSearch} 
                                    />
                                </div>
                                <div className="date-filter">
                                    <label htmlFor="date-filter">Filter by Date:</label>
                                    <input
                                        type="date"
                                        id="date-filter"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                    />
                                    {selectedDate && (
                                        <button 
                                            className="clear-filter"
                                            onClick={() => {
                                                setSelectedDate('');
                                                setCurrentPage(1);
                                            }}
                                        >
                                            Clear Filter
                                        </button>
                                    )}
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Loading activity logs...</div>
                            ) : error ? (
                                <div className="error">{error}</div>
                            ) : (
                                <>
                                    <div className="logs-table-container">
                                        <table className="logs-table">
                                            <thead>
                                                <tr>
                                                    <th>Time</th>
                                                    <th>User</th>
                                                    <th>Action</th>
                                                    <th>Entity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentLogs.map((log, index) => (
                                                    <tr key={index}>
                                                        <td>{formatDate(log.time)}</td>
                                                        <td>{log.user_name}</td>
                                                        <td>{log.action}</td>
                                                        <td>{log.entity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="pagination-activitity-logs">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="pagination-button"
                                            >
                                                Previous
                                            </button>
                                            
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="pagination-button"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}

                                    {/* Results count */}
                                    <div className="results-count">
                                        Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="statistics-dashboard">
                            <div className="statistics-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">👨‍🎓</div>
                                    <div className="stat-info">
                                        <h3>Total Students</h3>
                                        <p>{dashboardData.totalCounts.students}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">👩‍🏫</div>
                                    <div className="stat-info">
                                        <h3>Total Teachers</h3>
                                        <p>{dashboardData.totalCounts.teachers}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📚</div>
                                    <div className="stat-info">
                                        <h3>Total Classes</h3>
                                        <p>{dashboardData.totalCounts.classes}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📖</div>
                                    <div className="stat-info">
                                        <h3>Total Subjects</h3>
                                        <p>{dashboardData.totalCounts.subjects}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="statistics-charts">
                                <div className="chart-container">
                                    <h3>Activity Types Distribution</h3>
                                    <div className="chart-wrapper">
                                        <Bar 
                                            data={getActionChartData()}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Distribution of Activity Types'
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="chart-container">
                                    <h3>User Activity Distribution</h3>
                                    <div className="chart-wrapper">
                                        <Doughnut 
                                            data={getUserChartData()}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'right',
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function(context) {
                                                                return `${context.label}: ${context.raw}%`;
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="statistics-charts centered">
                                <div className="chart-container full-width">
                                    <h3>Hourly Activity Distribution</h3>
                                    <div className="chart-wrapper">
                                        <Bar 
                                            data={getHourlyChartData()}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Activities by Hour of Day'
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            stepSize: 1
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActivityLogs; 