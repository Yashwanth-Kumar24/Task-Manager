import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/login', { email, password });
      if (response.data.userId) {
        
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.name);
        alert('Login Successful!');
        navigate('/dashboard'); 
      }
      else{
         alert('Invalid Login');
      }
    } catch (error) {
      alert('Login Failed');
    }
  };

  const handleRegister = () => {
    navigate('/signup'); // Redirect to login
  };

  return (
    <div class="body">
      <div class="glass-container">
          <div class="login-box">
              <h2>Login</h2>
              <form onSubmit={handleLogin}>
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />                
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />                    
                  <button type="submit">Login</button>

                  <p>Don't have an account? <button id="register" onClick={handleRegister}>Join Now</button></p>
              </form>
          </div>
      </div>
    </div>
  );
};

export default Login;

    
