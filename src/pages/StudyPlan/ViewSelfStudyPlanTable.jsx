import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewSelfStudyPlan.css';

const ViewSelfStudyPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

 const fetchPlans = async () => {
  try {
    const goalId = 1;
    const res = await axios.get(`http://localhost:8000/api/self-study-plans/goal/${goalId}`);
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
              <table className="detail-table">
                <tbody>
                  <tr><th>Date</th><td>{selectedPlan.date}</td></tr>
                  <tr><th>Module</th><td>{selectedPlan.class_name}</td></tr>
                  <tr><th>Lesson</th><td>{selectedPlan.lesson}</td></tr>
                  <tr><th>Time</th><td>{selectedPlan.time}</td></tr>
                  <tr><th>Resources</th><td>{selectedPlan.resources}</td></tr>
                  <tr><th>Activities</th><td>{selectedPlan.activities}</td></tr>
                  <tr><th>Concentration</th><td>{selectedPlan.concentration}</td></tr>
                  <tr><th>Plan Follow</th><td>{selectedPlan.plan_follow}</td></tr>
                  <tr><th>Evaluation</th><td>{selectedPlan.evaluation}</td></tr>
                  <tr><th>Reinforcing</th><td>{selectedPlan.reinforcing}</td></tr>
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
