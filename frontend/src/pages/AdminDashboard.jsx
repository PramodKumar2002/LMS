import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard({ user }) {
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) nav('/'); // redirect non-admins
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // optional: add a backend admin stats endpoint '/admin/stats'
      const { data } = await api.get('/admin/stats').catch(()=>({ data: null }));
      setStats(data);
    } catch (e) {
      setStats(null);
    }
  };

  if (!user?.isAdmin) return <div className="card">Admin only</div>;

  return (
    <div className="card">
      <h3>Admin Dashboard</h3>

      {msg && <div className="notice">{msg}</div>}

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12, marginTop:12}}>
        <Link to="/admin/users" className="card" style={{padding:12, textDecoration:'none'}}>
          <h4>Manage Users</h4>
          <div className="small">View, edit memberships, promote/demote admins.</div>
          <div style={{marginTop:8, fontSize:12}}>{stats?.usersCount ? `${stats.usersCount} users` : ''}</div>
        </Link>

        <Link to="/admin/add-user" className="card" style={{padding:12, textDecoration:'none'}}>
          <h4>Add User / Admin</h4>
          <div className="small">Create new user or admin accounts.</div>
        </Link>

        <Link to="/books/add" className="card" style={{padding:12, textDecoration:'none'}}>
          <h4>Add Book</h4>
          <div className="small">Add new catalog items (books/movies).</div>
        </Link>

        <Link to="/books/update" className="card" style={{padding:12, textDecoration:'none'}}>
          <h4>Update Books</h4>
          <div className="small">Edit or correct book metadata / serial numbers.</div>
        </Link>

        <Link to="/transactions" className="card" style={{padding:12, textDecoration:'none'}}>
          <h4>Transactions</h4>
          <div className="small">Issue, return, view transaction reports.</div>
        </Link>

        <Link to="/membership" className="card" style={{padding:12, textDecoration:'none'}}>
          <h4>Membership</h4>
          <div className="small">Manage membership plans, add or extend.</div>
        </Link>

        <Link to="/maintenance" className="card" style={{padding:12, textDecoration:'none'}}>
          <h4>Maintenance / Reports</h4>
          <div className="small">Run reports, seeds and other admin utilities.</div>
        </Link>
      </div>

      <div style={{marginTop:16}}>
        <h4>Quick stats</h4>
        <div className="small">
          {stats ? (
            <div>
              <div>Users: {stats.usersCount ?? '-'}</div>
              <div>Books: {stats.booksCount ?? '-'}</div>
              <div>Active Transactions: {stats.activeTransactions ?? '-'}</div>
            </div>
          ) : <div>No stats available (optional server endpoint).</div>}
        </div>
      </div>
    </div>
  );
}