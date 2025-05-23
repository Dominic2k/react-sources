import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarTeacher from '../components/layout/SidebarTeacher';
import axios from "axios";
import "./StudentList.css";

const StudentList = () => {
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
        <ul className="student-list">
          {students.map((student) => (
            <li key={student.student_id}>
              {student.full_name} - {student.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found for this class.</p>
      )}
      </main>
    </div>
  );
};

export default StudentList;
