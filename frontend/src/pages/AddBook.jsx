import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './AddBook.css';

export default function AddBook({ user }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [serial, setSerial] = useState('');
  const [isMovie, setIsMovie] = useState(false);
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !author || !serial) return setMsg('Title, Author, and Serial No are mandatory');
    try {
      await api.post('/books', { title, author, serialNo: serial, isMovie });
      setMsg('Book added successfully!');
      nav('/search');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
    }
  };

  if (!user?.isAdmin) return <div className="card notice">Admin only</div>;

  return (
    <div className="addbook-container">
      <div className="card">
        <h2>Add New Book</h2>
        {msg && <div className="notice">{msg}</div>}
        <form onSubmit={submit} className="addbook-form">
          <label>Title</label>
          <input
            className="input"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Author</label>
          <input
            className="input"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label>Serial No</label>
          <input
            className="input"
            placeholder="Enter serial number"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isMovie}
              onChange={(e) => setIsMovie(e.target.checked)}
            />{' '}
            Is Movie
          </label>

          <button className="btn" type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
}
