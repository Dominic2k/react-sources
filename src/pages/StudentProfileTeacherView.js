// StudentProfileTeacherView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarTeacher from "../components/layout/SidebarTeacher";

const StudentProfileTeacherView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("goals");
  const [inClassPlans, setInClassPlans] = useState([]);
  const [selfStudyPlans, setSelfStudyPlans] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [commentTarget, setCommentTarget] = useState(null);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStudentDetail = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/teachers/student-profile/${studentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudent(response.data);
      } catch (error) {
        console.error("Failed to fetch student detail", error);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudentPlans = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/teachers/students/${studentId}/plans`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInClassPlans(response.data.in_class_plans || []);
        setSelfStudyPlans(response.data.self_study_plans || []);
      } catch (error) {
        console.error("Failed to fetch student plans", error);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/teachers/students/${studentId}/feedbacks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFeedbacks(response.data);
      } catch (err) {
        console.error("Failed to fetch feedbacks", err);
      }
    };

    fetchStudentDetail();
    fetchStudentPlans();
    fetchFeedbacks();
  }, [studentId]);

  const hasFeedback = (type, id, field) => {
    return feedbacks.some(f => f.entity_type === type && f.entity_id === id && f.field_name === field);
  };

  const getFeedbackContent = (type, id, field) => {
    const fb = feedbacks.find(f => f.entity_type === type && f.entity_id === id && f.field_name === field);
    return fb ? fb.content : "";
  };

  const renderTitle = (title) => {
    if (!title) return "No title";
    if (typeof title === "string") return title;
    if (typeof title === "object") {
      if ("text" in title) return title.text;
      if ("name" in title) return title.name;
      if ("title" in title) return title.title;
      return JSON.stringify(title);
    }
    return String(title);
  };

  const handleRightClick = (e, entityType, entityId, fieldName) => {
    e.preventDefault();
    setCommentTarget({ entity_type: entityType, entity_id: entityId, field_name: fieldName });
    setCommentContent(getFeedbackContent(entityType, entityId, fieldName));
  };

  const saveComment = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      `http://127.0.0.1:8000/api/feedbacks`, // ✅ Đổi lại đúng route
      { ...commentTarget, content: commentContent }, // bỏ `commentTarget &&` vì bạn đã kiểm tra ở ngoài
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setCommentTarget(null);
    setCommentContent("");

    // Reload feedbacks
    const refreshed = await axios.get(
      `http://127.0.0.1:8000/api/teachers/students/${studentId}/feedbacks`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFeedbacks(refreshed.data);
  };


  if (loading) return <div className="p-4">Loading student detail...</div>;
  if (!student) return <div className="p-4 text-red-600">Student not found or error occurred.</div>;

  const renderCell = (value, type, id, field) => (
    <td
      onContextMenu={(e) => handleRightClick(e, type, id, field)}
      style={{ position: "relative", cursor: "pointer" }}
    >
      {value}
      {hasFeedback(type, id, field) && <span className="ml-1 text-yellow-500">💬</span>}
    </td>
  );

  return (
    <div className="student-page flex">
      <SidebarTeacher />
      <main className="main-content">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back to Class
        </button>

        <h2 className="text-2xl font-bold mb-4">👤 Profile of {student.name}</h2>

        <nav className="tabs-nav">
          {['goals', 'inclass', 'selfstudy'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'goals' ? 'Goals' : tab === 'inclass' ? 'In-Class Plans' : 'Self-Study Plans'}
            </button>
          ))}
        </nav>

        {activeTab === "goals" && (
          <section className="card">
            <h3 className="text-xl font-semibold mb-2">🎯 Goals</h3>
            {student.goals?.length > 0 ? (
              <table className="custom-table">
                <thead><tr><th>Title</th><th>Description</th></tr></thead>
                <tbody>
                  {student.goals.map((goal) => (
                    <tr key={goal.id}>
                      {renderCell(renderTitle(goal.title), "goal", goal.id, "title")}
                      {renderCell(goal.description, "goal", goal.id, "description")}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (<p>No goals set.</p>)}
          </section>
        )}

        {activeTab === "inclass" && (
          <section className="card">
            <h3 className="text-xl font-semibold mb-2">📚 In-Class Plans</h3>
            {inClassPlans.length > 0 ? (
              <table className="custom-table">
                <thead>
                  <tr><th>Date</th><th>Skills</th><th>Summary</th><th>Assessment</th><th>Difficulties</th><th>Improvement</th><th>Solved</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  {inClassPlans.map((plan) => (
                    <tr key={plan.id}>
                      {renderCell(plan.date, "inclassplan", plan.id, "date")}
                      {renderCell(plan.skills_module, "inclassplan", plan.id, "skills_module")}
                      {renderCell(plan.lesson_summary, "inclassplan", plan.id, "lesson_summary")}
                      {renderCell(plan.self_assessment, "inclassplan", plan.id, "self_assessment")}
                      {renderCell(plan.difficulties_faced, "inclassplan", plan.id, "difficulties_faced")}
                      {renderCell(plan.improvement_plan, "inclassplan", plan.id, "improvement_plan")}
                      {renderCell(plan.problem_solved ? "Yes" : "No", "inclassplan", plan.id, "problem_solved")}
                      {renderCell(plan.additional_notes || "None", "inclassplan", plan.id, "additional_notes")}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (<p>No in-class plans available.</p>)}
          </section>
        )}

        {activeTab === "selfstudy" && (
          <section className="card">
            <h3 className="text-xl font-semibold mb-2">🏠 Self-Study Plans</h3>
            {selfStudyPlans.length > 0 ? (
              <table className="custom-table">
                <thead>
                  <tr><th>Date</th><th>Lesson</th><th>Time</th><th>Resources</th><th>Activities</th><th>Concentration</th><th>Plan Follow</th><th>Evaluation</th><th>Reinforcing</th></tr>
                </thead>
                <tbody>
                  {selfStudyPlans.map((plan) => (
                    <tr key={plan.id}>
                      {renderCell(plan.date, "selfstudyplan", plan.id, "date")}
                      {renderCell(plan.lesson, "selfstudyplan", plan.id, "lesson")}
                      {renderCell(plan.time, "selfstudyplan", plan.id, "time")}
                      {renderCell(plan.resources, "selfstudyplan", plan.id, "resources")}
                      {renderCell(plan.activities, "selfstudyplan", plan.id, "activities")}
                      {renderCell(plan.concentration, "selfstudyplan", plan.id, "concentration")}
                      {renderCell(plan.plan_follow, "selfstudyplan", plan.id, "plan_follow")}
                      {renderCell(plan.evaluation, "selfstudyplan", plan.id, "evaluation")}
                      {renderCell(plan.reinforcing, "selfstudyplan", plan.id, "reinforcing")}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (<p>No self-study plans available.</p>)}
          </section>
        )}

        {commentTarget && (
          <div className="fixed bg-white shadow-md border rounded p-3 top-1/3 left-1/3 z-50">
            <h4 className="font-semibold mb-2">📝 Comment</h4>
            <textarea
              className="w-full border p-2"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={4}
            />
            <div className="mt-2 flex justify-end space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={saveComment}
              >
                Save
              </button>
              <button
                className="bg-gray-300 text-black px-3 py-1 rounded"
                onClick={() => setCommentTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentProfileTeacherView;