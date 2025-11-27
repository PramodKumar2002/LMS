import React, { useState } from 'react';
import api from '../api';

export default function Membership({ user }) {
  const [duration, setDuration] = useState(6);
  const [msg, setMsg] = useState('');

  const add = async () => {
    try {
      const { data } = await api.post('/membership/add', { durationMonths: duration });
      setMsg('Membership added');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const extend = async () => {
    try {
      const { data } = await api.put('/membership/update', { action: 'extend', durationMonths: duration });
      setMsg('Extended');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const cancel = async () => {
    try {
      const { data } = await api.put('/membership/update', { action: 'cancel' });
      setMsg('Cancelled');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="card">
      <h3>Membership</h3>
      <div className="small">Select duration; default 6 months</div>
      <select className="input" value={duration} onChange={e=>setDuration(+e.target.value)}>
        <option value={6}>6 months</option>
        <option value={12}>12 months</option>
        <option value={24}>24 months</option>
      </select>
      <div style={{marginTop:8}}>
        <button className="btn" onClick={add}>Add Membership</button>
        <button className="btn" onClick={extend} style={{marginLeft:8}}>Extend</button>
        <button className="btn" onClick={cancel} style={{marginLeft:8}}>Cancel</button>
      </div>
      {msg && <div className="notice" style={{marginTop:8}}>{msg}</div>}
    </div>
  );
}
