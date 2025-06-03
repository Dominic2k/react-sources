import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from '../../components/layout';
import axios from 'axios';
import AchievementUpload from './AchievementUpload';
import AchievementItem from './AchievementItem';
import './AchievementPage.css';

function AchievementPage() {
  const [achievements, setAchievements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [filter, setFilter] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = 'http://localhost:8000/api/achievements';

  useEffect(() => {
    fetchAchievements();
  }, [filter, filterValue]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      let url = API_URL;
      
      if (filter === 'student') {
        url = `${API_URL}/student/${filterValue}`;
      } else if (filter === 'class-subject') {
        url = `${API_URL}/class-subject/${filterValue}`;
      } else if (filter === 'semester') {
        url = `${API_URL}/semester/${filterValue}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setAchievements(response.data.data || response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingAchievement(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (achievement) => {
    setEditingAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleSaveAchievement = async (data) => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      if (editingAchievement) {
        // Update existing achievement
        const response = await axios.put(
          `${API_URL}/${editingAchievement.id}`,
          data,
          { headers }
        );
        setAchievements(achievements.map(item =>
          item.id === editingAchievement.id ? response.data : item
        ));
      } else {
        // Create new achievement
        const response = await axios.post(API_URL, data, { headers });
        setAchievements([...achievements, response.data]);
      }
      
      setIsModalOpen(false);
      setEditingAchievement(null);
    } catch (err) {
      console.error('Error saving achievement:', err);
      setError('Failed to save achievement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setAchievements(achievements.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting achievement:', err);
      setError('Failed to delete achievement');
    }
  };

  if (loading) return <div className="loading">Loading achievements...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="achievement-page">
      <Sidebar />
      <div className="achievement-main">
        <Header />
        <main className="achievement-content">
          <div className="achievement-header">
            <h2>Achievements</h2>
            <button className="add-achievement-button" onClick={handleAddClick}>
              + Add Achievement
            </button>
          </div>
          <div className="achievement-list">
            {achievements.map((item) => (
              <AchievementItem
                key={item.id}
                image={item.file_url}
                title={item.title}
                description={item.description}
                subjectName={item.class_subject?.name || 'Unknown'}
                date={item.achievement_date}
                semester={item.semester}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEditClick(item)}
              />
            ))}
          </div>

          <AchievementUpload
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingAchievement(null);
            }}
            onSubmit={handleSaveAchievement}
            achievementToEdit={editingAchievement}
          />
        </main>
      </div>
    </div>
  );
}

export default AchievementPage;
