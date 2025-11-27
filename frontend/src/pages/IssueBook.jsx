// ...existing code...
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLocation } from 'react-router-dom';

export default function IssueBook({ user }) {
  const loc = useLocation();
  const preBookId = loc.state?.bookId;
  const [bookId, setBookId] = useState(preBookId || '');
  const [availableInfo, setAvailableInfo] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [email, setEmail] = useState(''); // new - target user email (admin)
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);

  useEffect(() => {
    if (bookId) loadBook(bookId);
    else {
      setAvailableInfo(null);
      // default return date (15 days ahead)
      const d = new Date(); d.setDate(d.getDate() + 15);
      setReturnDate(d.toISOString().slice(0, 10));
    }
  }, [bookId]);

  const loadBook = async (idOrSerial) => {
    setLoadingBook(true);
    setAvailableInfo(null);
    setMsg('');
    try {
      let resp;
      // try by ID
      try {
        resp = await api.get(`/books/${idOrSerial}`);
      } catch (_e) {
        // not found by id — try serial endpoint
        try {
          resp = await api.get('/books/serial', { params: { serialNo: idOrSerial } });
        } catch (_e2) {
          // last fallback => search endpoint
          resp = await api.get('/books', { params: { q: idOrSerial } });
        }
      }

      const data = resp?.data;
      const book = Array.isArray(data) ? data[0] : data;
      if (!book) {
        setMsg('Book not found');
        setAvailableInfo(null);
      } else {
        setAvailableInfo(book);
        // ensure default return date present
        if (!returnDate) {
          const d = new Date(); d.setDate(d.getDate() + 15);
          setReturnDate(d.toISOString().slice(0,10));
        }
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed loading book');
      setAvailableInfo(null);
    } finally {
      setLoadingBook(false);
    }
  };

  const validateReturnDate = (dateStr) => {
    console.log('Validating return date:', dateStr);
    if (!dateStr) return 'Return date required';
    console.log('Parsed return date string:', dateStr);
    const now = new Date();
    const ret = new Date(dateStr + 'T23:59:59'); // include end of day
    if (isNaN(ret.getTime())) return 'Invalid date';
    if (ret < now) return 'Return date cannot be in the past';
    const max = new Date();
    max.setDate(now.getDate() + 15);
    console.log(max)
    console.log('Computed max return date:', max.toISOString().slice(0,10)); 
    console.log(ret>max); 
    // if (ret > max) return 'Return date cannot be more than 15 days from now';
    console.log('Return date is valid');
    return null;
  };

  const submit = async (e) => {
    console.log('Submitting issue form');
    e.preventDefault();
    setMsg('');
    console.log('Validating inputs:', { bookId, returnDate, email });
    if (!bookId) return setMsg('Enter a book id or serial');
    const dateError = validateReturnDate(returnDate);
    if (dateError) return setMsg(dateError);

    console.log(availableInfo)

    if (availableInfo && availableInfo.available === false) {
      return setMsg('Selected copy is not available for issue.');
    }

    console.log('Issuing book:', { bookId, returnDate, email });

    // if admin provided an email, include it in request so backend issues to that user
    const body = { bookId, returnDate };
    if (user?.isAdmin && email?.trim()) body.email = email.trim();

    setLoading(true);
    try {
      console.log('Issuing book with body:', body);
      await api.post('/transactions/issue', body);
      setMsg(user?.isAdmin && body.email ? `Issued to ${body.email}` : 'Issued successfully.');
      setAvailableInfo(null);
      setBookId('');
      setEmail('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Issue failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Issue Book</h3>

        <form onSubmit={submit}>
          <label>Book Id or Serial (paste id or serial)</label>
          <input
            className="input"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="Book id or serial"
          />

          {user?.isAdmin && (
            <>
              <label style={{ marginTop: 8 }}>User Email (leave empty to issue to current user)</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                type="email"
              />
            </>
          )}

          {loadingBook && <div className="small" style={{ marginTop: 6 }}>Loading book...</div>}
          {availableInfo && (
            <div className="small" style={{ marginTop: 8 }}>
              <div><strong>{availableInfo.title}</strong> — {availableInfo.author}</div>
              <div>Serial: {availableInfo.serialNo || '-'}</div>
              <div>Available: {availableInfo.available === false ? 'No' : 'Yes'}</div>
              {availableInfo.remarks && <div>Notes: {availableInfo.remarks}</div>}
            </div>
          )}

          <label style={{ marginTop: 10 }}>Return Date (max 15 days from issue)</label>
          <input
            className="input"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />

          <div style={{ marginTop: 8 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Issuing...' : 'Issue'}
            </button>
          </div>

          {msg && <div style={{ marginTop: 8 }} className="notice">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
// ...existing code...