import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  return (
    <div className="header">
      <div>
        <h2 style={{margin:0}}>Library Management</h2>
        <div className="small">Simple MERN example</div>
      </div>
      <div className="nav">
        <Link to="/" className="btn">Dashboard</Link>
        <Link to="/search" className="btn">Search</Link>
        <Link to="/membership" className="btn">Membership</Link>
        {user?.isAdmin && <Link to="/maintenance" className="btn">Maintenance</Link>}
        <button onClick={logout} className="btn">Logout</button>
      </div>
    </div>
  );
}
