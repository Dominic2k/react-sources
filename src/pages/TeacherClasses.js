import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TeacherClasses.css";

const TeacherClasses = () => {
const { teacherId } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // const teacherId = 2;

  useEffect(() => {
    if (!teacherId) return; // phòng trường hợp teacherId chưa có

    const fetchTeacherClasses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/teacher/${teacherId}/classes`);
        setClasses(response.data.data);

      } catch (err) {
        setError("Failed to fetch classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [teacherId]);

  if (loading) return <p>Loading classes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="main-content">
      <h2>My Teaching Classes</h2>
      <section className="classes-grid">
        {Array.isArray(classes) && classes.length > 0 ? (classes.map((cls) => (
            <article key={cls.class_id} className="class-card">
              <strong>{cls.class_name}</strong>
              <div className="class-info">
                <i className="fas fa-users" aria-hidden="true"></i>{" "}
                {cls.student_count || 0} students
              </div>
              <button
                className="btn-details"
                type="button"
                onClick={() => navigate(`/teacher/class/${cls.class_id}/students`)}
              >
                View Details
              </button>
            </article>
          ))
        ) : (
          <p>No classes found.</p>
        )}

      </section>
    </main>
  );
};

export default TeacherClasses;
