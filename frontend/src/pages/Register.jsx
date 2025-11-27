import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) return setErr('Enter email and password');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      nav('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-sub">Please login to continue</p>

        {err && <div className="error-box">{err}</div>}

        <form onSubmit={submit} className="login-form">
          <label>Email</label>
          <input
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button className="btn login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="info-text">
          Use Postman to create admin/user first time.  
        </p>
      </div>
    </div>
  );
}
