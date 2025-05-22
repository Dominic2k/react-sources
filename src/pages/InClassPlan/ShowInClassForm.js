import React, { useEffect, useState } from "react";
import "./ShowInClassForm.css";
import TeacherTagBox from "../../components/layout/TeacherTagBox";

const ShowInClassForm = ({ subjectId }) => {
  const [plans, setPlans] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
  const token = localStorage.getItem("token"); // hoặc nơi bạn lưu token

  console.log("Fetching:", subjectId);

  fetch(`http://localhost:8000/api/student/subject/${subjectId}/in-class-plans`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API response:", data);
      setPlans(data.data);
    })
    .catch((error) => console.error("Fetch error:", error));
}, [subjectId]);


  console.log(plans);
//Xử lí xóa in-class Plan mới nhất
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`http://localhost:8000/api/student/subject/${subjectId}/in-class-plans/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            setPlans((prev) => prev.filter((plan) => plan.id !== id));
          } else {
            console.error("Failed to delete");
          }
        })
        .catch((error) => console.error("Delete error:", error));
    }
  };

  const handleEdit = (plan) => {
  console.log("Editing plan:", plan);
  setEditId(plan.id);
  setEditForm({
    ...plan,
    date: plan.date ? plan.date.slice(0, 10) : "", // Format YYYY-MM-DD
    problem_solved: String(plan.problem_solved),   // Ensure string type
  });
};

  const handleCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const token = localStorage.getItem("token");
  const handleUpdate = (id) => {
    fetch(`http://localhost:8000/api/student/subject/${subjectId}/in-class-plans/${id}`, {
      method: "PUT",
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(editForm),
    })
      .then((response) => {
        if (response.ok) {
          setPlans((prev) =>
            prev.map((plan) => (plan.id === id ? editForm : plan))
          );
          setEditId(null);
        } else {
          console.error("Failed to update");
        }
      })
      .catch((error) => console.error("Update error:", error));
  };

  return (
    <div className="table-container">
       <div style={{ marginTop: "20px" }}>
        <TeacherTagBox
          entityId={subjectId}
          entityType="in_class_plan"
          currentUserId={currentUserId}
        />
      </div>
      <table className="inclass-table">
        <thead>
          <tr>
            <th colSpan="8" style={{ backgroundColor: "#C00032", color: "#fff" }}>
              In-class
            </th>
          </tr>
          <tr>
            <th>Date</th>
            <th>Skills/Module</th>
            <th>Lesson Summary</th>
            <th>Self-assessment</th>
            <th>Difficulties</th>
            <th>Plan</th>
            <th>Problem Solved</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              {editId === plan.id ? (
                <>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="skills_module"
                      value={editForm.skills_module || ""}
                      onChange={handleChange}
                    >
                      <option value="TOEIC">TOEIC</option>
                      <option value="IT English">IT English</option>
                      <option value="Speaking">Speaking</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      name="lesson_summary"
                      value={editForm.lesson_summary || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="self_assessment"
                      value={editForm.self_assessment || ""}
                      onChange={handleChange}
                    >
                      <option value="1">1 - Need more practice</option>
                      <option value="2">2 - Sometimes difficult</option>
                      <option value="3">3 - No problem</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      name="difficulties_faced"
                      value={editForm.difficulties_faced || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <textarea
                      name="improvement_plan"
                      value={editForm.improvement_plan || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="problem_solved"
                      value={editForm.problem_solved}
                      onChange={handleChange}
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>Not yet</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(plan.id)}>Update</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{plan.date || "N/A"}</td>
                  <td>{plan.skills_module}</td>
                  <td>{plan.lesson_summary}</td>
                  <td>{plan.self_assessment}</td>
                  <td>{plan.difficulties_faced}</td>
                  <td>{plan.improvement_plan}</td>
                  <td>{plan.problem_solved === 1 ? "Yes" : "Not yet"}</td>
                  <td>
                    <button onClick={() => handleEdit(plan)}>Edit</button>
                    <button onClick={() => handleDelete(plan.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default ShowInClassForm;
