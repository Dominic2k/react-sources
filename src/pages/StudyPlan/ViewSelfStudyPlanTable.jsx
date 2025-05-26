import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Header } from '../../components/layout';
import axios from 'axios';
import './ViewSelfStudyPlan.css';

const ViewSelfStudyPlan = () => {
    const location = useLocation();
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const subjectId = queryParams.get('subjectId');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://127.0.0.1:8000/api/student/subject/${subjectId}/self-study-plans`);
            setPlans(res.data);
        } catch (err) {
            console.error('Failed to fetch plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handleEdit = (planId) => {
        console.log('Chỉnh sửa kế hoạch:', planId);
    };

    const handleGoToForm = () => {
        navigate('/self-study-plans/create');
    };

    const handleBackToList = () => {
        setSelectedPlan(null);
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="view-self-study-page">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="self-study-container">
                    <div className="top-bar">
                        <h2>📚 Self Study Plans</h2>
                        <div className="buttons">
                            <button onClick={handleGoToForm}>➕ Create New</button>
                            {selectedPlan && (
                                <button onClick={handleBackToList}>
                                    🔙 Back
                                </button>
                            )}
                        </div>
                    </div>

                    {!selectedPlan && (
                        <div className="plan-list">
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
                        </div>
                    )}

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
