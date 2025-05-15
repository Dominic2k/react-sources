import React, { useEffect, useState } from "react";
import "./ShowInClassForm.css";

const ShowInClassForm = ({ subjectId }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // Nếu có subjectId, lọc theo subject
    const url = subjectId 
      ? `http://localhost:8000/api/in-class-plans?subject_id=${subjectId}`
      : "http://localhost:8000/api/in-class-plans";
      
    fetch(url)
      .then((response) => response.json())
      .then((data) => setPlans(data))
      .catch((error) => console.error("Fetch error:", error));
  }, [subjectId]);

  return (
    <div className="table-container">
      <table className="inclass-table">
        <thead>
          <tr>
            <th colSpan="7" style={{ backgroundColor: "#C00032", color: "#fff" }}>
              In-class
            </th>
          </tr>
          <tr>
            <th>Date</th>
            <th>Skills/Module</th>
            <th>My lesson<br />What did I learn today?</th>
            <th>
              Self-assessment<br />
              1: I need more practice<br />
              2: I sometimes find this difficult<br />
              3: No problem!
            </th>
            <th>My difficulties</th>
            <th>My plan</th>
            <th>Problem solved</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.date || "N/A"}</td>
              <td>{plan.skills_module}</td>
              <td>{plan.lesson_summary}</td>
              <td>{plan.self_assessment}</td>
              <td>{plan.difficulties_faced}</td>
              <td>{plan.improvement_plan}</td>
              <td>{plan.problem_solved === 1 ? "Yes" : "Not yet"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowInClassForm;
