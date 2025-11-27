import React, { useState } from 'react';
import api from '../api';

export default function Membership({ user }) {
  const [duration, setDuration] = useState(6);
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState(''); // for admin to target another user
  const [loading, setLoading] = useState(false);

  const payloadFor = () => {
    const p = { durationMonths: duration };
    if (user?.isAdmin && email?.trim()) p.email = email.trim();
    return p;
  };

  const add = async () => {
    setMsg('');
    setLoading(true);
    try {
      const body = payloadFor();
      await api.post('/membership/add', body);
      setMsg(user?.isAdmin && body.email ? `Membership added for ${body.email}` : 'Membership added');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const extend = async () => {
    setMsg('');
    setLoading(true);
    try {
      const body = payloadFor();
      await api.put('/membership/update', { ...body, action: 'extend' });
      setMsg(user?.isAdmin && body.email ? `Extended membership for ${body.email}` : 'Extended');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    setMsg('');
    setLoading(true);
    try {
      const body = {};
      if (user?.isAdmin && email?.trim()) body.email = email.trim();
      await api.put('/membership/update', { action: 'cancel', ...body });
      setMsg(user?.isAdmin && body.email ? `Cancelled membership for ${body.email}` : 'Cancelled');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Membership</h3>
      <div className="small">Select duration; default 6 months</div>

      {user?.isAdmin && (
        <div style={{ marginTop: 8 }}>
          <label>User Email (leave empty to act on your own account)</label>
          <input
            className="input"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
      )}

      <select className="input" value={duration} onChange={e=>setDuration(+e.target.value)} style={{ marginTop: 8 }}>
        <option value={6}>6 months</option>
        <option value={12}>12 months</option>
        <option value={24}>24 months</option>
      </select>

      <div style={{marginTop:8}}>
        <button className="btn" onClick={add} disabled={loading}>Add Membership</button>
        <button className="btn" onClick={extend} disabled={loading} style={{marginLeft:8}}>Extend</button>
        <button className="btn" onClick={cancel} disabled={loading} style={{marginLeft:8}}>Cancel</button>
      </div>

      {msg && <div className="notice" style={{marginTop:8}}>{msg}</div>}
    </div>
  );
}