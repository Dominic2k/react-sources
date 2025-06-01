import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Header } from '../../components/layout';
import './ActivityLogs.css';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view activity logs');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/admin/activity-logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setError('Error loading activity logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      // Replace space with T to make it a valid ISO string
      const isoString = dateString.replace(' ', 'T');
      const date = new Date(isoString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return dateString; // Return original string if date is invalid
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
      return dateString; // Return original string if there's an error
    }
  };

  // Filter logs by selected date
  const filteredLogs = selectedDate
    ? logs.filter(log => {
        const logDate = new Date(log.time).toLocaleDateString('vi-VN');
        const selectedDateObj = new Date(selectedDate).toLocaleDateString('vi-VN');
        return logDate === selectedDateObj;
      })
    : logs;

  // Calculate pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to first page when date changes
  };

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
          <h2 className="activity-logs-title">Activity Logs</h2>
          
          {/* Date Filter */}
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
          
          {loading && <div className="loading">Loading activity logs...</div>}
          {error && <div className="error">{error}</div>}
          
          {!loading && !error && (
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
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs; 