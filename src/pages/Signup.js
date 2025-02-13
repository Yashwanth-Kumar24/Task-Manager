import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users', { name, email, password });
      alert('Signup Successful');
      navigate('/');
    } catch (error) {
      alert('Signup Failed');
    }
  };

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div class="body">
      <div class="glass-container">
          <div class="login-box">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Signup</button>
            </form>
            <p>Already have an account? <button id="register" onClick={handleLogin}>Login</button></p>
          </div>
        </div>
      </div>
  );
};

export default Signup;
