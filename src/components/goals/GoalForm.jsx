import React, { useState, useEffect } from 'react';

const GoalForm = ({ class_subject_id, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalType: 'semester',
    startDate: '',
    endDate: '',
    priority: 'high',
    isPrivate: false
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Log localStorage values when component mounts
  useEffect(() => {
    console.log('LocalStorage values:');
    console.log('token:', localStorage.getItem('token'));
    console.log('user_id:', localStorage.getItem('user_id'));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validate required fields
    if (!formData.title.trim()) {
      setFormError('Vui lòng nhập tiêu đề.');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setFormError('Vui lòng nhập ngày bắt đầu và kết thúc.');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.');
      return;
    }

    try {
      setFormLoading(true);
      
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      console.log('Class Subject ID:', class_subject_id);

      if (!token) {
        console.log('No token found');
        setFormError('Vui lòng đăng nhập để tạo goal.');
        return;
      }

      if (!userId) {
        console.log('No user_id found');
        setFormError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';
        return;
      }

      // Prepare request data
      const requestData = {
        title: formData.title,
        description: formData.description,
        goal_type: formData.goalType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        priority: formData.priority,
        is_private: formData.isPrivate,
        class_subject_id: class_subject_id,
        student_id: userId,
        status: 'not_started'
      };

      console.log('Request data:', requestData);

      const response = await fetch(`http://127.0.0.1:8000/api/student/subjects/${class_subject_id}/goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        // Xử lý các loại lỗi cụ thể
        if (data.message === 'Student not found') {
          console.log('Student not found error');
          setFormError('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          window.location.href = '/login';
        } else if (response.status === 401) {
          console.log('Unauthorized error');
          setFormError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          window.location.href = '/login';
        } else if (response.status === 422) {
          // Validation errors
          const errors = data.errors || {};
          console.log('Validation errors:', errors);
          const errorMessages = Object.values(errors).flat();
          setFormError(errorMessages.join(', ') || 'Dữ liệu không hợp lệ');
        } else if (response.status === 404) {
          setFormError('Không tìm thấy môn học. Vui lòng thử lại sau.');
        } else {
          console.error('Error response:', data);
          setFormError(data.message || 'Có lỗi xảy ra khi tạo goal');
        }
        return;
      }

      console.log('Goal created successfully:', data);
      
      setFormSuccess('Tạo goal thành công!');
      onSuccess();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error('Error creating goal:', err);
      setFormError('Có lỗi xảy ra khi tạo goal. Vui lòng thử lại sau.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={formWrapperStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>Tạo Goal Mới</h2>
          <button onClick={onClose} style={closeBtnStyle}>&times;</button>
        </div>

        {formError && <div style={errorStyle}>{formError}</div>}
        {formSuccess && <div style={successStyle}>{formSuccess}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Tiêu đề *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
          </div>

          <div>
            <label style={labelStyle}>Mô tả</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              style={{ ...inputStyle, minHeight: '80px' }} 
            />
          </div>

          <div style={grid2Cols}>
            <div>
              <label style={labelStyle}>Loại mục tiêu *</label>
              <select 
                name="goalType" 
                value={formData.goalType} 
                onChange={handleChange} 
                style={inputStyle}
                required
              >
                <option value="semester">Học kỳ</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Mức độ ưu tiên *</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                style={inputStyle}
                required
              >
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
                <option value="critical">Cực kỳ quan trọng</option>
              </select>
            </div>
          </div>

          <div style={grid2Cols}>
            <div>
              <label style={labelStyle}>Ngày bắt đầu *</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>
            <div>
              <label style={labelStyle}>Ngày kết thúc *</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                style={inputStyle} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="isPrivate" 
              name="isPrivate" 
              checked={formData.isPrivate} 
              onChange={handleChange} 
              style={{ width: '20px', height: '20px' }} 
            />
            <label htmlFor="isPrivate" style={{ cursor: 'pointer' }}>Riêng tư (chỉ bạn mới nhìn thấy)</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Hủy</button>
            <button type="submit" disabled={formLoading} style={submitBtnStyle}>
              {formLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;

// Styles
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const formWrapperStyle = {
  background: '#fff', borderRadius: '10px', padding: '30px',
  width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
};

const headerStyle = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', marginBottom: '24px'
};

const closeBtnStyle = {
  background: 'none', border: 'none', fontSize: '24px',
  cursor: 'pointer', color: '#666'
};

const labelStyle = {
  display: 'block', marginBottom: '6px',
  fontSize: '14px', fontWeight: '500', color: '#444'
};

const inputStyle = {
  width: '100%', padding: '10px 12px',
  borderRadius: '6px', border: '1px solid #ddd',
  fontSize: '16px', boxSizing: 'border-box'
};

const grid2Cols = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
};

const cancelBtnStyle = {
  padding: '10px 18px', borderRadius: '6px',
  border: '1px solid #ddd', background: '#fff',
  color: '#444', fontSize: '16px', cursor: 'pointer'
};

const submitBtnStyle = {
  padding: '10px 18px', borderRadius: '6px', border: 'none',
  background: '#2196F3', color: '#fff', fontSize: '16px',
  cursor: 'pointer'
};

const errorStyle = {
  color: '#fff', background: '#F44336',
  padding: '10px 14px', borderRadius: '6px', marginBottom: '16px'
};

const successStyle = {
  color: '#fff', background: '#4CAF50',
  padding: '10px 14px', borderRadius: '6px', marginBottom: '16px'
};
