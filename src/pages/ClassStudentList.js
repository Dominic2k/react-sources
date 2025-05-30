import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarTeacher from '../components/layout/SidebarTeacher';
import SetDeadline from '../pages/Deadline/SetDealine';
import axios from "axios";
import "./StudentList.css";

const ClassStudentList = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState(""); 
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
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

        if(data.teacher_id) {
          setTeacher(data.teacher_id);
        }
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
      <SidebarTeacher teacherId={teacher} onSetDeadline={() => setShowDeadlineModal(true)} />
      <main className="main-content">
      <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
      <h2>Student List - {className}</h2>
      {loading ? (
        <p>Loading students...</p>
      ) : students.length > 0 ? (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
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
      {showDeadlineModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowDeadlineModal(false)}>✖</button>
            <SetDeadline />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassStudentList;
