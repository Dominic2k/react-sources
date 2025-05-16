import React, { useEffect, useState } from "react";
import axios from "axios"; 

const TeacherTagBox = ({ entityId, entityType }) => {
  const [teachers, setTeachers] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId") || "1"; // fallback tạm

  // Fetch danh sách giáo viên
  useEffect(() => {
    fetch("http://localhost:8000/api/public/teachers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setTeachers(data.data);
        } else {
          console.error("Dữ liệu giáo viên không hợp lệ:", data);
        }
      })
      .catch((err) => console.error("Lỗi khi fetch teachers:", err));
  }, []);

  // Fetch danh sách tag cho entity hiện tại
  useEffect(() => {
    fetch("http://localhost:8000/api/teacher-tags")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (tag) => tag.entity_id === entityId && tag.entity_type === entityType
        );
        setTags(filtered);
      })
      .catch((err) => console.error("Lỗi khi fetch tags:", err));
  }, [entityId, entityType]);

  // Gửi tag mới
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTeacherId || !message.trim()) {
      alert("Vui lòng chọn giáo viên và nhập lời nhắn.");
      return;
    }

    const payload = {
      teacher_id: selectedTeacherId,
      tagged_by: currentUserId,
      entity_type: entityType,
      entity_id: entityId,
      message,
    };

    setLoading(true);

    axios
      .post("http://localhost:8000/api/teacher-tags", payload)
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setTags([data.data || data, ...tags]);
          setSelectedTeacherId("");
          setMessage("");
        } catch (e) {
          console.error("Response không phải JSON:", text);
          alert("Lỗi server khi gửi tag, thử lại sau.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi gửi tag:", err);
        alert("Lỗi khi gửi tag, thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Đánh dấu đã giải quyết
  const markResolved = (id) => {
    fetch(`http://localhost:8000/api/teacher-tags/${id}/resolve`, {
      method: "POST",
    })
      .then(() => {
        setTags((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, resolved_at: new Date().toISOString() } : t
          )
        );
      })
      .catch((err) => console.error("Lỗi khi đánh dấu đã giải quyết:", err));
  };

  // Xoá tag
  const deleteTag = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tag này?")) return;

    fetch(`http://localhost:8000/api/teacher-tags/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTags((prev) => prev.filter((t) => t.id !== id));
      })
      .catch((err) => console.error("Lỗi khi xoá tag:", err));
  };

  return (
    <div className="teacher-tag-box" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h4>📌 Danh sách Tag giáo viên</h4>

      <div className="tag-list">
        {tags.length === 0 ? (
          <p>Chưa có tag nào.</p>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="tag-item"
              style={{
                marginBottom: 15,
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            >
              <p>
                <strong>👤 Giáo viên:</strong>{" "}
                {teachers.find((t) => t.user_id === tag.teacher_id)?.name || `GV ${tag.teacher_id}`}
              </p>
              <p>
                <strong>💬 Lời nhắn:</strong> {tag.message}
              </p>
              <p>
                <strong>📅 Ngày:</strong>{" "}
                {tag.created_at ? new Date(tag.created_at).toLocaleString() : ""}
              </p>
              <p>
                <strong>✅ Trạng thái:</strong>{" "}
                {tag.resolved_at ? "Đã giải quyết" : "Chờ phản hồi"}
              </p>
              <button onClick={() => markResolved(tag.id)} disabled={!!tag.resolved_at}>
                ✅ Đánh dấu đã giải quyết
              </button>
              <button onClick={() => deleteTag(tag.id)} style={{ marginLeft: 10 }}>
                ❌ Xoá
              </button>
            </div>
          ))
        )}
      </div>

      <form className="tag-form" style={{ marginTop: 30 }} onSubmit={handleSubmit}>
        <h5>➕ Gửi Tag mới</h5>
        <select
          value={selectedTeacherId}
          onChange={(e) => setSelectedTeacherId(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">-- Chọn giáo viên --</option>
          {teachers.map((teacher) => (
            <option key={teacher.user_id} value={teacher.user_id}>
              {teacher.name || `GV ${teacher.user_id}`}
            </option>
          ))}
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập nội dung tag..."
          rows={3}
          style={{ width: "100%", marginTop: 10, padding: 8 }}
          disabled={loading}
        />

        <button type="submit" style={{ marginTop: 10 }} disabled={loading}>
          {loading ? "Đang gửi..." : "📩 Gửi tag"}
        </button>
      </form>
    </div>
  );
};

export default TeacherTagBox;
