import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Nếu không có token, chuyển hướng đến trang đăng nhập
      return;
    }

    const logoutUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/logout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Đặt token ở đây
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Đăng xuất thất bại');
        }

        localStorage.removeItem('token'); // Xóa token sau khi đăng xuất
        navigate('/login');

      } catch (err) {
        console.error('Lỗi khi đăng xuất:', err.message);
      }
    };

    logoutUser();
  }, [navigate]);

  return null;
}

export default Logout;
