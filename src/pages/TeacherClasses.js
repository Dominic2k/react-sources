import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import SidebarTeacher from '../components/layout/SidebarTeacher';
import { Header } from '../components/layout';
import axios from "axios";
import "./TeacherClasses.css";

const TeacherClasses = () => {
  const { teacherId } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!teacherId) return; 

    const fetchTeacherClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:8000/api/teacher/${teacherId}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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
    <div className="page-container">
      <SidebarTeacher />
      <div className="main-content">
        <Header />
        <h3 style={{ paddingLeft: '20px' }}>My Teaching Classes</h3>
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
                  onClick={() => navigate(`/classes/${cls.class_id}/students`)}
                >
                  View Details
                </button>
              </article>
            ))
          ) : (
            <p>No classes found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeacherClasses;
