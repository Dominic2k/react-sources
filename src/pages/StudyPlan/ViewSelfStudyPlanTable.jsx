import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewSelfStudyPlan.css';

const ViewSelfStudyPlan = ({classSubjectId}) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (classSubjectId) {
      fetchPlans();
    }
  }, [classSubjectId]);

 const fetchPlans = async () => {
  try {
    // const goalId = 1;
    // const selfId = 2;
    const res = await axios.get(`http://127.0.0.1:8000/api/self-study-plans/class-subject/${classSubjectId}`);
    setPlans(res.data);
  } catch (err) {
    console.error('Failed to fetch plans:', err);
  }
};

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="view-self-study-page">
      <div className="main-content">

        <div className="self-study-container">
          <div className="top-bar">
            <div className="buttons">

              {/* Nút "Back" luôn hiển thị khi có kế hoạch được chọn */}
              <button
                onClick={handleBackToList}
                style={{ display: selectedPlan ? 'inline-block' : 'none' }}
              >
                🔙 Back
              </button>
            </div>
          </div>

          {/* Danh sách các kế hoạch */}
          {!selectedPlan && (
            <div className="plan-list">
              {plans.length > 0 ? (
                <ul>
                  {plans.map((plan) => (
                    <li
                      key={plan.id}
                      className="plan-item"
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <strong>{plan.class_name}</strong> – {plan.date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">No self-study plans available</p>
              )}
            </div>
          )}

          {/* Chi tiết kế hoạch */}
          {selectedPlan && (
            <div className="plan-detail">
              <h3>📄 Study Plan Detail</h3>
              <table className="detail-table" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ backgroundColor: '#b90e32', color: 'white', textAlign: 'center' }}>
                    <th colSpan="8">In-class</th>
                  </tr>
                  <tr style={{ backgroundColor: '#f1f1f1', fontWeight: 'bold', textAlign: 'center' }}>
                    <th>Date</th>
                    <th>Module</th>
                    <th>Lesson</th>
                    <th>Time</th>
                    <th>Resources</th>
                    <th>Activities</th>
                    <th>Concentration</th>
                    <th>Plan Follow</th>
                    <th>Evaluation</th>
                    <th>Reinforcing</th>
                  </tr>
                  </thead>
                <tbody>
                  <tr  style={{ textAlign: 'center' }}>
                  <td>{selectedPlan.date}</td>
                  <td>{selectedPlan.class_name}</td>
                  <td>{selectedPlan.lesson}</td>
                  <td>{selectedPlan.time}</td>
                  <td>{selectedPlan.resources}</td>
                  <td>{selectedPlan.activities}</td>
                  <td>{selectedPlan.concentration}</td>
                  <td>{selectedPlan.plan_follow}</td>
                  <td>{selectedPlan.evaluation}</td>
                  <td>{selectedPlan.reinforcing}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSelfStudyPlan;

