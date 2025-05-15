import React, { useState } from 'react';
import AchievementUpload from './AchievementUpload';
import AchievementItem from './AchievementItem';
import './AchievementPage.css';
import { Sidebar } from '../../components/layout';

function AchievementPage() {
  const [achievements, setAchievements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAchievement = (data) => {
    setAchievements([...achievements, data]);
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    const updated = [...achievements];
    updated.splice(index, 1);
    setAchievements(updated);
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
        <div className="achievement-header">
          <h2>My Achievements</h2>
        </div>

        <div className="left-panel">
          <button className="add-achievement-button" onClick={() => setIsModalOpen(true)}>
            + Add Achievement
          </button>
        </div>

        <div className="achievement-list">
          {achievements.map((item, index) => (
            <AchievementItem
              key={index}
              image={item.file_url}
              title={item.title}
              description={item.description}
              subjectName={subjectMap[item.class_subject_id] || 'Unknown'}
              date={item.achievement_date}
              semester={item.semester}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      </div>

      <AchievementUpload
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAchievement}
      />
    </div>
  );
}

export default AchievementPage;
