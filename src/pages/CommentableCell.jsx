import React, { useState } from "react";
import axios from "axios";

const CommentableCell = ({ value, entityType, entityId, fieldName, teacherId, comments, refreshComments }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [content, setContent] = useState(
    comments?.find(c => c.field_name === fieldName)?.content || ""
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const hasComment = comments?.some(c => c.field_name === fieldName);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.pageX, y: e.pageY });
    setShowPopup(true);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://127.0.0.1:8000/api/feedbacks", {
        entity_type: entityType,
        entity_id: entityId,
        teacher_id: teacherId,
        field_name: fieldName,
        content: content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowPopup(false);
      refreshComments();
    } catch (err) {
      alert("Failed to save comment");
    }
  };

  return (
    <td onContextMenu={handleContextMenu} className="relative comment-cell" style={{ cursor: "pointer" }}>
      {value} {hasComment && <span style={{ marginLeft: 5, color: "orange" }}>📝</span>}
      {showPopup && (
        <div
          className="comment-popup"
          style={{ position: "absolute", top: position.y, left: position.x, background: "#fff", border: "1px solid #ccc", padding: 10, zIndex: 1000 }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{ width: 200 }}
          />
          <div style={{ marginTop: 5, textAlign: "right" }}>
            <button onClick={handleSubmit} style={{ marginRight: 5 }}>💾 Save</button>
            <button onClick={() => setShowPopup(false)}>❌ Close</button>
          </div>
        </div>
      )}
    </td>
  );
};

export default CommentableCell;
