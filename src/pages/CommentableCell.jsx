import React, { useState } from "react";
import axios from "axios";
// import "./CommentableCell.css";

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
  };

  return (
    <td onContextMenu={handleContextMenu} className="relative comment-cell">
      {value} {hasComment && <span className="comment-icon">📝</span>}
      {showPopup && (
        <div className="comment-popup" style={{ top: position.y, left: position.x }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="popup-actions">
            <button onClick={handleSubmit}>💾 Save</button>
            <button onClick={() => setShowPopup(false)}>❌ Close</button>
          </div>
        </div>
      )}
    </td>
  );
};

export default CommentableCell;
