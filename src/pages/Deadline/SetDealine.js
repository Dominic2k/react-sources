import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SetDeadline.css';

export default function CreateDeadlineForm() {
  const { classId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classId) {
      alert("Không xác định được lớp học!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:8000/api/classes/${classId}/deadlines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          due_date: new Date(dueDate).toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Tạo deadline thành công");
        setTitle("");
        setDescription("");
        setDueDate("");
      } else {
        alert("Lỗi: " + (data.error || "Không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi tạo deadline:", error);
      alert("Đã xảy ra lỗi khi tạo deadline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchClassInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/classes/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok && result.success && result.data) {
        setClassName(result.data.class_name);
      } else {
        setClassName("Không xác định");
      }
    } catch (err) {
      console.error("Lỗi khi lấy tên lớp:", err);
      setClassName("Không xác định");
    }
  };

  if (classId) {
    fetchClassInfo();
  }
}, [classId]);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Tạo Deadline cho lớp {className}</h2>

      <div className="form-group">
        <label>Tiêu đề:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          placeholder="Nhập tiêu đề deadline"/>
      </div>

      <div className="form-group">
        <label>Mô tả:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          placeholder="Nhập mô tả (tùy chọn)"/>
      </div>

      <div className="form-group">
        <label>Hạn chót:</label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          disabled={loading}/>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Đang gửi..." : "Tạo Deadline"}
      </button>
    </form>
  );
}
