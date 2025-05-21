import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AchievementUpload from './AchievementUpload';
import AchievementItem from './AchievementItem';
import './AchievementPage.css';
import { Sidebar, Header } from '../../components/layout';

function AchievementPage() {
  const [achievements, setAchievements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = 'http://127.0.0.1:8000/api/achievements';
  useEffect(() => {
    axios.get(API_URL, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Đặt token ở đây
      },
    })

      .then(res => setAchievements(res.data))
      .catch(err => console.error('Error fetching achievements:', err));
  }, []);

  const handleAddAchievement = (data) => {
    axios.post(API_URL, data)
      .then(res => {
        setAchievements([...achievements, res.data]);
        setIsModalOpen(false);
      })
      .catch(err => {
        console.error('Error adding achievement:', err);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`,{
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Đặt token ở đây
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
        <Header/>
        <div className="achievement-header">
          <h2>My Achievements</h2>
        </div>

        <div className="left-panel">
          <button className="add-achievement-button" onClick={() => setIsModalOpen(true)}>
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

// import React, { useState } from 'react';
// import AchievementUpload from './AchievementUpload';
// import AchievementItem from './AchievementItem';
// import './AchievementPage.css';
// import { Sidebar } from '../../components/layout';

// function AchievementPage() {
//   const [achievements, setAchievements] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleAddAchievement = (data) => {
//     setAchievements([...achievements, data]);
//     setIsModalOpen(false);
//   };

//   const handleDelete = (index) => {
//     const updated = [...achievements];
//     updated.splice(index, 1);
//     setAchievements(updated);
//   };
  
// const subjectMap = {
//   1: 'English',
//   2: 'Web Programming',
//   3: 'Database',
  
// };

//   return (
//     <div className="achievement-container">
//       <Sidebar />
//       <div className="main-content">
//         <div className="achievement-header">
//           <h2>My Achievements</h2>
//         </div>

//         <div className="left-panel">
//           <button className="add-achievement-button" onClick={() => setIsModalOpen(true)}>
//             + Add Achievement
//           </button>
//         </div>

//         <div className="achievement-list">
//           {achievements.map((item, index) => (
//             <AchievementItem
//               key={index}
//               image={item.file_url}
//               title={item.title}
//               description={item.description}
//               subjectName={subjectMap[item.class_subject_id] || 'Unknown'}
//               date={item.achievement_date}
//               semester={item.semester}
//               onDelete={() => handleDelete(index)}
//             />
//           ))}
//         </div>
//       </div>

//       <AchievementUpload
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleAddAchievement}
//       />
//     </div>
//   );
// }

// export default AchievementPage;
