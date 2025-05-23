// LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import style from './Login.css'

function LoginForm() {

  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');      // Nếu đã có token, chuyển hướng ngay đến trang home
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail,
                password:password }),
        });

        const data = await response.json();
        console.log('Login response:', data); // Log response để debug

        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        // Lưu token và user_id
        localStorage.setItem('token', data.access_token);
       if (data.user) {
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('user_name', data.user.full_name);

        // Chuyển hướng theo role
        if (data.user.role === 'teacher') {
            navigate(`/teacher/${data.user.id}/classes`);
        } else if (data.user.role === 'student') {
            navigate(`/home`);
        } else {
            navigate('/home'); // fallback nếu role không xác định
        }
        } else {
            throw new Error("Không có thông tin user trong phản hồi.");
        }
        } catch (err) {
            setError(err.message);
        }
        };

    return (
        <div className="login-container">

            <div className="login-outside">
                <div className='login-inside'>
                    <h1>Welcome</h1>
                    <form onSubmit={handleLogin}>
        
                        <div className="login-form-group">
                            <label htmlFor="email">Email:</label>
                            <div className="login-input-icon">
                                <input type="email" id="email" name="email" placeholder="Your email" required onChange={(e) => setUserEmail(e.target.value)} value={userEmail}/>
                                    <i className="fa-solid fa-envelope" />
                            </div>
                        </div>
                        <br />
                        <div className="login-form-group">
                            <label htmlFor="password">Password:</label>
                            <div className="login-input-icon">
                                <input placeholder="Your password" type="password"  value={password} onChange={(e) => setPassword(e.target.value)}  required />
                                <i className="fa-solid fa-lock" />
                            </div>
                        </div>
                        
                        <div className="forgot-password"> <span>Forgot your password? </span> <a href="#">Click here</a></div>
                        <div className="login-button-container">
                            <button type="submit" className="login-button">Log in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  );
}

export default LoginForm;