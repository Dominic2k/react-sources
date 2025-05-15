import React, { useEffect, useState } from "react";
import { Sidebar, Header } from "../components/layout";
import axios from "axios";
import "./TeacherClasses.css";

const TeacherClasses = ({ }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const teacherId = 2;
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/teacher/${teacherId}/classes`
        );
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
    <main className="main-content" role="main" aria-label="My Teaching Classes">
      <h2>My Teaching Classes</h2>
      <section className="classes-grid" aria-label="List of teaching classes">
        {classes.map((cls) => (
          <article
            key={cls.class_id}
            className="class-card"
            tabIndex="0"
            aria-labelledby={`${cls.class_id}-title`}
            aria-describedby={`${cls.class_id}-desc`}
          >
            <strong id={`${cls.class_id}-title`}>{cls.class_name}</strong>
            <div className="class-info" id={`${cls.class_id}-desc`}>
              <i className="fas fa-users" aria-hidden="true"></i>{" "}
              {cls.student_count || 0} students
            </div>
            <button
              className="btn-details"
              type="button"
              aria-label={`View details for ${cls.class_name}`}
            >
              View Details
            </button>
          </article>
        ))}
      </section>
    </main>
  );
};

export default TeacherClasses;
