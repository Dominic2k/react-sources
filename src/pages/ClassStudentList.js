import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarTeacher from '../components/layout/SidebarTeacher';
import axios from "axios";
import "./StudentList.css";

const ClassStudentList = () => {
  const { teacherId,classId } = useParams();
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState(""); // State để lưu tên lớp
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if(!classId){
      console.warn("classId is null or undefined!");
      return;
    }
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/classes/${classId}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = response.data.data;
        setStudents(data.students || []);
        setClassName(data.class_name || `Class ${classId}`);
      } catch (error) {
        console.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  return (
    <div className="student-page">
      <SidebarTeacher />
      <main className="main-content">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back to Classes</button>
      <h2>Student List - {className}</h2>
      {loading ? (
        <p>Loading students...</p>
      ) : students.length > 0 ? (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Upcoming Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>
                  {student.upcoming_deadline ? (
                    <span className="deadline-badge">
                      {student.upcoming_deadline}
                    </span>
                  ) : (
                    "None"
                  )}
                </td>
                <td>
                  <button
                    className="view-profile-btn"
                    onClick={() => navigate(`/student/profile${student.student_id}`)}
                  >
                    👤 View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found for this class.</p>
      )}
      </main>
    </div>
  );
};

export default ClassStudentList;
