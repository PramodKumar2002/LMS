import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminLogin({ setUser }) {
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
      if (!data.user?.isAdmin) return setErr('Admin account required');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser && setUser(data.user);
      nav('/admin');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>
        <p className="login-sub">Sign in with your admin account</p>

        {err && <div className="error-box">{err}</div>}

        <form onSubmit={submit} className="login-form">
          <label>Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email" />
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          <div style={{marginTop:8}}>
            <button className="btn login-btn" type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
}