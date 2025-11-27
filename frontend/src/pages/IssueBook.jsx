import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLocation } from 'react-router-dom';

export default function IssueBook({ user }) {
  const loc = useLocation();
  const preBookId = loc.state?.bookId;
  const [bookId, setBookId] = useState(preBookId || '');
  const [availableInfo, setAvailableInfo] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(()=> {
    if(bookId) loadBook(bookId);
  }, [bookId]);

  const loadBook = async (id) => {
    try {
      const { data } = await api.get(`/books/${id}`);
      setAvailableInfo(data);
      // default return date 15 days ahead
      const d = new Date();
      d.setDate(d.getDate() + 15);
      setReturnDate(d.toISOString().slice(0,10));
    } catch(e){ setAvailableInfo(null); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    if(!bookId) return setMsg('Select a book id');
    try {
      const { data } = await api.post('/transactions/issue', { bookId, returnDate });
      setMsg('Issued successfully.');
      setAvailableInfo(null);
      setBookId('');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Issue failed');
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Issue Book</h3>
        <form onSubmit={submit}>
          <label>Book Id (select from search or paste id)</label>
          <input className="input" value={bookId} onChange={e=>setBookId(e.target.value)} />
          {availableInfo && <div className="small">Title: {availableInfo.title} | Author: {availableInfo.author}</div>}
          <label>Return Date (cannot be more than 15 days from issue):</label>
          <input className="input" type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} />
          <div style={{marginTop:8}}>
            <button className="btn" type="submit">Issue</button>
          </div>
          {msg && <div style={{marginTop:8}} className="notice">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
