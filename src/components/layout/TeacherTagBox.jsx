import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TeacherTag.css";

const TeacherTagBox = ({ entityId, entityType }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [sentTags, setSentTags] = useState([]);

  // Fetch teacher list
  useEffect(() => {
    fetch("http://localhost:8000/api/public/teachers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeachers(data);
        } else if (Array.isArray(data.data)) {
          setTeachers(data.data);
        }
      });
  }, []); // Thêm mảng dependencies rỗng để chỉ gọi API một lần khi component mount

  // Fetch sent tags when showTags is true
  useEffect(() => {
    if (showTags) {
      axios
        .get(
          `http://localhost:8000/api/teacher-tags?entity_id=${entityId}&entity_type=${entityType}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setSentTags(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to load tags:", err);
        });
    }
  }, [showTags, entityId, entityType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeacherId || !message.trim()) {
      alert("Please select a teacher and enter your message.");
      return;
    }

    const postData = {
      entity_id: entityId,
      entity_type: entityType,
      teacher_id: selectedTeacherId,
      message: message,
    };
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/teacher-tags", postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      alert("Tag sent successfully.");
      setSelectedTeacherId("");
      setMessage("");
      setShowForm(false);
    } catch (error) {
      console.error("Error sending tag:", error);
      alert("Failed to send tag. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-tag-wrapper">
  {/* Buttons */}
  <div className="tag-button-group">
    <button onClick={() => setShowForm(!showForm)}>
      {showForm ? "Close Tag Form" : "➕ Tag Teacher"}
    </button>
    <button onClick={() => setShowTags(!showTags)}>
      {showTags ? "Hide Sent Tags" : "📜 View Sent Tags"}
    </button>
  </div>

  {/* Overlay Form */}
  {(showForm || showTags) && (
    <div className="tag-overlay">
      {showForm && (
        <form onSubmit={handleSubmit} className="tag-form">
          <h5>📩 Tag a Teacher</h5>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
          >
            <option value="">-- Select a teacher --</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.user.id}>
                {teacher.user.full_name || `Teacher ${teacher.id}`}
              </option>
            ))}
          </select>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            rows={3}
          />

          <div className="form-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Tag"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {showTags && (
        <div className="tag-history">
  <h5>📜 Sent Tags</h5>
  {sentTags.length === 0 ? (
    <p>No tags sent yet.</p>
  ) : (
    <ul>
      {sentTags.map((tag) => (
        <li key={tag.id}>
          <div><strong>Teacher:</strong> {tag.teacher?.user?.full_name || `${tag.teacher_name}`}</div>
          <div><strong>Time:</strong> {new Date(tag.created_at).toLocaleString()}</div>
          <div><strong>Message:</strong> {tag.message}</div>
        </li>
      ))}
    </ul>
  )}
</div>

      )}
    </div>
  )}
</div>

  );
};

export default TeacherTagBox;
