import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register({ setUser }) {

  const [name, setName] = useState("");   // added name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name || !email || !password)
      return setErr("Enter name, email and password");

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      nav("/");
    } catch (err) {
      setErr(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">

      <div className="login-card">
        <h2 className="login-title">Welcome</h2>
        <p className="login-sub">Please Register here!</p>

        {err && <div className="error-box">{err}</div>}

        <div className="login-form">
          <label>Full Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            type="text"
          />
        </div>

        <form onSubmit={submit} className="login-form">

          <label>Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button className="btn login-btn" type="submit">
            Register
          </button>
        </form>

        <p className="info-text">
          You have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
