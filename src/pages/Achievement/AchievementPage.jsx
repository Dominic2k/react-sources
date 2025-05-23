import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AchievementUpload from './AchievementUpload';
import AchievementItem from './AchievementItem';
import './AchievementPage.css';
import { Sidebar, Header } from '../../components/layout';

function AchievementPage() {
  const [achievements, setAchievements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const API_URL = 'http://127.0.0.1:8000/api/achievements';

  useEffect(() => {
    axios.get(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then(res => setAchievements(res.data))
      .catch(err => console.error('Error fetching achievements:', err));
  }, []);

  const handleAddClick = () => {
    setEditingAchievement(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (achievement) => {
    setEditingAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleSaveAchievement = (data) => {
    if (editingAchievement) {
      axios.post(`${API_URL}/${editingAchievement.id}?_method=PUT`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          setAchievements(achievements.map(item =>
            item.id === editingAchievement.id ? res.data : item
          ));
          setIsModalOpen(false);
          setEditingAchievement(null);
        })
        .catch(err => console.error('Error updating achievement:', err));
    } else {
      axios.post(API_URL, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          setAchievements([...achievements, res.data]);
          setIsModalOpen(false);
        })
        .catch(err => console.error('Error adding achievement:', err));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then(() => {
        setAchievements(achievements.filter(item => item.id !== id));
      })
      .catch(err => console.error('Error deleting achievement:', err));
  };

  const subjectMap = {
    1: 'English',
    2: 'Web Programming',
    3: 'Database',
  };

  return (
    <div className="achievement-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="achievement-header">
          <h5>My Achievements</h5>
        </div>
        <div className="left-panel">
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
              subjectName={subjectMap[item.class_subject_id] || 'Unknown'}
              date={item.achievement_date}
              semester={item.semester}
              onDelete={() => handleDelete(item.id)}
              onEdit={() => handleEditClick(item)}
            />
          ))}
        </div>
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
    </div>
  );
}

export default AchievementPage;
