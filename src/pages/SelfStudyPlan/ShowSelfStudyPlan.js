import React, { useEffect, useState } from "react";
import "./ShowSelfStudyPlan.css";
import TeacherTagBox from "../../components/layout/TeacherTagBox";

const ShowSelfStudyPlan = ({ subjectId }) => {
    const [plans, setPlans] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8000/api/student/subject/${subjectId}/self-study-plans`, {
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
            setPlans(data.data);
        })
        .catch((error) => console.error("Fetch error:", error));
    }, [subjectId]);

    const handleDelete = (id) => {
        const token = localStorage.getItem("token");
        if (window.confirm("Are you sure you want to delete this item?")) {
            fetch(`http://localhost:8000/api/student/subject/${subjectId}/self-study-plans/${id}`, {
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
        setEditId(plan.id);
        setEditForm({
            ...plan,
            date: plan.date ? plan.date.slice(0, 10) : "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setEditId(null);
        setEditForm({});
    };

    const handleUpdate = (id) => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8000/api/student/subject/${subjectId}/self-study-plans/${id}`, {
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
                    entityType="self_study_plan"
                />
            </div>
            <div className="table-scrollable">
                <table className="inclass-table">
                    <thead>
                        <tr>
                            <th colSpan="11" style={{ backgroundColor: "#2196F3", color: "#fff" }}>
                                Self-study
                            </th>
                        </tr>
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
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan.id}>
                                {editId === plan.id ? (
                                    <>
                                        <td>
                                            <input type="date" name="date" value={editForm.date || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="lesson" value={editForm.lesson || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="time" value={editForm.time || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="resources" value={editForm.resources || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="activities" value={editForm.activities || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="concentration" value={editForm.concentration || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="plan_follow" value={editForm.plan_follow || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="evaluation" value={editForm.evaluation || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="reinforcing" value={editForm.reinforcing || ""} onChange={handleChange} />
                                        </td>
                                        <td>
                                            <button onClick={() => handleUpdate(plan.id)} className="edit-btn">Update</button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(plan.id)} className="delete-btn">Delete</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{plan.date || "N/A"}</td>
                                        <td>{plan.lesson}</td>
                                        <td>{plan.time}</td>
                                        <td>{plan.resources}</td>
                                        <td>{plan.activities}</td>
                                        <td>{plan.concentration}</td>
                                        <td>{plan.plan_follow}</td>
                                        <td>{plan.evaluation}</td>
                                        <td>{plan.reinforcing}</td>
                                        <td>
                                            <button onClick={() => handleEdit(plan)} className="edit-btn">Edit</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(plan.id)} className="delete-btn">Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowSelfStudyPlan; 