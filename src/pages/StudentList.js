import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentList.css";

const StudentList = () => {
//   const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const classId = 1;
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/classes/${classId}/students`);
        setStudents(response.data.data || []);
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
      <button className="btn-back" onClick={() => navigate(-1)}>← Back to Classes</button>
      <h2>Student List for Class #{classId}</h2>
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
    </div>
  );
};

export default StudentList;
