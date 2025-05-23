import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function LoginForm() {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  // Mảng các câu trích dẫn về học tập
  const quotes = [
    "\"Education is the passport to the future, for tomorrow belongs to those who prepare for it today.\" - Malcolm X",
    "\"The beautiful thing about learning is that no one can take it away from you.\" - B.B. King",
    "\"Live as if you were to die tomorrow. Learn as if you were to live forever.\" - Mahatma Gandhi",
    "\"The more that you read, the more things you will know. The more that you learn, the more places you'll go.\" - Dr. Seuss",
    "\"Education is not the filling of a pail, but the lighting of a fire.\" - W.B. Yeats"
  ];

  // Chọn một câu trích dẫn ngẫu nhiên khi component được mount
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      // Kiểm tra role của người dùng để điều hướng
      const userRole = localStorage.getItem('user_role');
      if (userRole === 'admin') {
        navigate('/admin/students');
      } else {
        navigate('/home');
      }
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
                password: password 
            }),
        });

        const data = await response.json();
        console.log('Login response:', data); // Log response để debug

        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }

        // Lưu token và user_id
        localStorage.setItem('token', data.access_token);
        
        // Lưu thông tin user
        if (data.user) {
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('user_role', data.user.role || 'student');
            console.log('Stored user_id:', data.user.id);
            console.log('User role:', data.user.role);
            
            // Điều hướng dựa trên role
            if (data.user.role === 'admin') {
                navigate('/admin/students');
            } else {
                navigate('/home');
            }
        } else {
            console.warn('No user data in response:', data);
            navigate('/home');
        }
    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <div className="login-container">
        <div className="login-welcome-section">
            <h1 className="welcome-title">Welcome to</h1>
            <h2 className="welcome-subtitle">Learning Journal Management System</h2>
            <p className="welcome-text">
              Track, manage, and enhance your learning journey with our comprehensive platform.
            </p>
            <p className="welcome-quote">{quote}</p>
        </div>

        <div className="login-outside">
            <div className='login-inside'>
                <h1>Login</h1>
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
                            <input placeholder="Your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <i className="fa-solid fa-lock" />
                        </div>
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="login-button-container">
                      <button type="submit" className="login-button">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default LoginForm;
