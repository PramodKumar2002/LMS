import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateBook({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  useEffect(()=> {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
    } catch(e) {}
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/books/${id}`, book);
      setMsg('Updated');
      nav('/search');
    } catch(err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  if(!user?.isAdmin) return <div className="card">Admin only</div>;
  if(!book) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h3>Update Book</h3>
      {msg && <div className="notice">{msg}</div>}
      <form onSubmit={submit}>
        <label>Title</label>
        <input className="input" value={book.title} onChange={e=>setBook({...book, title: e.target.value})} />
        <label>Author</label>
        <input className="input" value={book.author} onChange={e=>setBook({...book, author: e.target.value})} />
        <label>Serial No</label>
        <input className="input" value={book.serialNo} onChange={e=>setBook({...book, serialNo: e.target.value})} />
        <label><input type="checkbox" checked={book.isMovie} onChange={e=>setBook({...book, isMovie: e.target.checked})} /> Is Movie</label>
        <div style={{marginTop:8}}><button className="btn" type="submit">Save</button></div>
      </form>
    </div>
  );
}
