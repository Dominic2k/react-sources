import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const CommentableCell = ({ value, entityType, entityId, fieldName, teacherId, comments, refreshComments }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [content, setContent] = useState(
    comments?.find(c => c.field_name === fieldName)?.content || ""
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);
  const cellRef = useRef(null);

  const hasComment = comments?.some(c => c.field_name === fieldName);

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    let x = rect.left;
    let y = rect.top;

    if (x + 300 > viewportWidth) {
      x = viewportWidth - 320;
    }

    if (y + 200 > viewportHeight) {
      y = rect.top - 200;
    }

    setPosition({ x, y });
    setShowPopup(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) &&
          cellRef.current && !cellRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://127.0.0.1:8000/api/feedbacks", {
        entity_type: entityType,
        entity_id: entityId,
        field_name: fieldName,
        content: content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowPopup(false);
      
      const newComment = {
        entity_type: entityType,
        entity_id: entityId,
        field_name: fieldName,
        content: content,
        created_at: new Date().toISOString()
      };
      
      if (typeof refreshComments === 'function') {
        refreshComments(newComment);
      }
    } catch (err) {
      console.error("Failed to save comment:", err);
      alert("Failed to save comment. Please try again.");
    }
  };

  return (
    <td 
      ref={cellRef}
      onContextMenu={handleContextMenu} 
      className="relative comment-cell" 
      style={{ cursor: "pointer" }}
    >
      {value} {hasComment && <span style={{ marginLeft: 5, color: "orange" }}>📝</span>}
      {showPopup && (
        <div
          ref={popupRef}
          className="comment-popup"
          style={{ 
            position: "fixed", 
            top: position.y, 
            left: position.x, 
            background: "#fff", 
            border: "1px solid #ccc", 
            padding: 10, 
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            borderRadius: "4px",
            minWidth: "300px",
            maxWidth: "300px"
          }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            Comment for: {fieldName}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            style={{ 
              width: "100%", 
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "8px",
              resize: "vertical"
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button 
              onClick={handleSubmit}
              style={{
                padding: "4px 12px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Save
            </button>
            <button 
              onClick={() => setShowPopup(false)}
              style={{
                padding: "4px 12px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </td>
  );
};

export default CommentableCell;
