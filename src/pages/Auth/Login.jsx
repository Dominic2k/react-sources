// LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import style from './Login.css'

function LoginForm() {
    localStorage.clear()
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
        if (data.user && data.user.id) {
            localStorage.setItem('user_id', data.user.id);
            console.log('Stored user_id:', data.user.id); // Log để debug
        } else {
            console.warn('No user_id in response:', data); // Log warning nếu không có user_id
        }

        navigate("/home");
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