import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewSelfStudyPlan.css';

const ViewSelfStudyPlan = () => {
  const { subjectId } = useParams();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!subjectId) {
        console.warn("subjectId is undefined");
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://127.0.0.1:8000/api/student/subjects/${subjectId}/self-study-plans`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPlans(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy kế hoạch học tập:', err.response?.data || err.message);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [subjectId]);

  const handleSelectPlan = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    setSelectedPlan(plan);
  };

  const handleEdit = (planId) => {
    // Viết xử lý chỉnh sửa tại đây
    console.log('Chỉnh sửa kế hoạch:', planId);
  };

  const handleDelete = (planId) => {
    // Viết xử lý xóa tại đây
    console.log('Xóa kế hoạch:', planId);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>

      {plans.length === 0 ? (
        <p>Không có kế hoạch học tập nào cho môn học này.</p>
      ) : (
        <table className="custom-table w-full">
          <thead>
            <tr>
              <th colSpan="11" className="header-title">Sefl Study</th>
            </tr>
            <tr>
              <th>Date</th>
              <th>Skills/Module</th>
              <th>Lesson</th>
              <th>Time</th>
              <th>Resources</th>
              <th>Activity</th>
              <th>Plan follow</th>
              <th>Evaluation</th>
              <th>Reinforcing</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                  className="hover:bg-gray-100">
                <td>{plan.date}</td>
                <td>{plan.module || '-'}</td>
                <td>{plan.lesson}</td>
                <td>{plan.time || '-'}</td>
                <td>{plan.resources || '-'}</td>
                <td>{plan.activities}</td>
                <td>{plan.plan_follow}</td> {/* ✅ sửa đúng field */}
                <td>{plan.evaluation || '-'}</td>
                <td>{plan.reinforcing}</td>
                <td>{plan.notes}</td>
                <td>
                  <button onClick={() => handleEdit(plan.id)} className="edit-btn">✏️</button>
                  <button onClick={() => handleDelete(plan.id)} className="delete-btn ml-2">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewSelfStudyPlan;
