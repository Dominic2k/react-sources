import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarTeacher from "../components/layout/SidebarTeacher";
import { Header } from '../components/layout';
import CommentableCell from "./CommentableCell";
import "./StudentProfileTeacherView.css";

const StudentProfileTeacherView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("goals");
  const [inClassPlans, setInClassPlans] = useState([]);
  const [selfStudyPlans, setSelfStudyPlans] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [commentTarget, setCommentTarget] = useState(null);
  const [commentContent, setCommentContent] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStudentDetail = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/teachers/student-profile/${studentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudent(response.data.student);
        setGoals(response.data.goals || []);
      } catch (error) {
        console.error("Failed to fetch student detail", error);
        setStudent(null);
        setGoals([]);
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
    return feedbacks.some(
      (f) => f.entity_type === type && f.entity_id === id && f.field_name === field
    );
  };

  const getFeedbackContent = (type, id, field) => {
    const fb = feedbacks.find(
      (f) => f.entity_type === type && f.entity_id === id && f.field_name === field
    );
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
    const teacherId = localStorage.getItem("user_id");

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/feedbacks`,
        { 
          ...commentTarget, 
          content: commentContent,
          teacher_id: teacherId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentTarget(null);
      setCommentContent("");

      const refreshed = await axios.get(
        `http://127.0.0.1:8000/api/teachers/students/${studentId}/feedbacks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(refreshed.data);
    } catch (error) {
      alert("Failed to save comment. Please try again.");
      console.error(error);
    }
  };

  // Pagination functions
  const getCurrentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const totalPages = (items) => Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div className="p-4">Loading student detail...</div>;
  if (!student)
    return <div className="p-4 text-red-600">Student not found or error occurred.</div>;

  const renderCell = (value, type, id, field) => {
    const getEntityType = (type) => {
      switch(type) {
        case 'goal': return 'goal';
        case 'inclassplan': return 'in_class_plan';
        case 'selfstudyplan': return 'self_study_plan';
        default: return type;
      }
    };

    const handleCommentUpdate = (newComment) => {
      setFeedbacks(prevFeedbacks => {
        // Tìm và xóa comment cũ nếu có
        const filteredFeedbacks = prevFeedbacks.filter(
          f => !(f.entity_type === newComment.entity_type && 
                 f.entity_id === newComment.entity_id && 
                 f.field_name === newComment.field_name)
        );
        // Thêm comment mới
        return [...filteredFeedbacks, newComment];
      });
    };

    return (
      <CommentableCell
        value={value}
        entityType={getEntityType(type)}
        entityId={id}
        fieldName={field}
        comments={feedbacks}
        refreshComments={handleCommentUpdate}
      />
    );
  };

  const renderPagination = (items) => {
  const pages = totalPages(items);
  if (pages <= 1) return null;

  const buttonStyle = {
    padding: '0.25rem 0.75rem', // py-1 px-3
    fontSize: '0.875rem', // text-sm
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: '0.25rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s ease-in-out',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563eb', // blue-600
    color: 'white',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem', // gap-2
        marginTop: '1rem', // mt-4
      }}
    >
      <button
        style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {[...Array(pages)].map((_, index) => {
        const isActive = currentPage === index + 1;
        return (
          <button
            key={index + 1}
            style={isActive ? activeButtonStyle : buttonStyle}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        );
      })}

      <button
        style={currentPage === pages ? disabledButtonStyle : buttonStyle}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pages}
      >
        Next
      </button>
    </div>
  );
};


  return (
    <div className="student-page flex">
      <SidebarTeacher />
      <div className="main-content">
        <Header />
        <div className="p-4">
          <button
  style={{
    fontSize: '0.875rem', // text-sm
    color: '#fff', // text-white
    padding: '0.25rem 0.75rem', // py-1 px-3
    backgroundColor: '#2563eb', // bg-gray-200
    border: 'none', // border-none
    borderRadius: '0.25rem', // rounded
    transition: 'background-color 0.2s ease-in-out', // transition-colors
    cursor: 'pointer',
    marginLeft: '1rem', // ml-4
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')} // hover:bg-gray-300
  onMouseLeave={(e) => (e.target.style.backgroundColor = '#2563eb ')}
  onClick={() => navigate(-1)}
>
  ← Back to Class
</button>


          <h2 className="text-2xl font-bold mb-4 mt-4">👤 Profile of {student.name}</h2>

          <nav className="tabs-nav">
            {["goals", "inclass", "selfstudy"].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1); // Reset to first page when changing tabs
                }}
              >
                {tab === "goals"
                  ? "Goals"
                  : tab === "inclass"
                  ? "In-Class Plans"
                  : "Self-Study Plans"}
              </button>
            ))}
          </nav>

          {activeTab === "goals" && (
            <section className="card">
              <h3 className="text-xl font-semibold mb-2">🌟 Goals</h3>
              {goals.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentItems(goals).map((goal) => (
                          <tr key={goal.id}>
                            {renderCell(renderTitle(goal.title), "goal", goal.id, "title")}
                            {renderCell(goal.description, "goal", goal.id, "description")}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(goals)}
                </>
              ) : (
                <p>No goals set.</p>
              )}
            </section>
          )}

          {activeTab === "inclass" && (
            <section className="card">
              <h3 className="text-xl font-semibold mb-2">📚 In-Class Plans</h3>
              {inClassPlans.length > 0 ? (
                <>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Skills</th>
                          <th>Summary</th>
                          <th>Self-Assessment</th>
                          <th>Difficulties</th>
                          <th>Improvement</th>
                          <th>Solved</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentItems(inClassPlans).map((plan) => (
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
                  </div>
                  {renderPagination(inClassPlans)}
                </>
              ) : (
                <p>No in-class plans available.</p>
              )}
            </section>
          )}

          {activeTab === "selfstudy" && (
            <section className="card">
              <h3 className="text-xl font-semibold mb-2">🏠 Self-Study Plans</h3>
              {selfStudyPlans.length > 0 ? (
                <>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Date</th>
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
                        {getCurrentItems(selfStudyPlans).map((plan) => (
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
                  </div>
                  {renderPagination(selfStudyPlans)}
                </>
              ) : (
                <p>No self-study plans available.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileTeacherView;