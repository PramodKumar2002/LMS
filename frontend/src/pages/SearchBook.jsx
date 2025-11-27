import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function SearchBook({ user }) {
  const [term, setTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const nav = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    // simple debounce for search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!term || term.length < 2) {
      setBooks([]);
      setMsg(term ? 'Type at least 2 characters' : '');
      return;
    }

    debounceRef.current = setTimeout(() => {
      search(term);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [term]);

  const search = async (q) => {
    setLoading(true);
    setMsg('');
    try {
      // Try a typical search endpoint. If backend uses another path, update accordingly.
      const { data } = await api.get('/books', { params: { q } }).catch(async () => {
        // fallback: try /books/search
        const r = await api.get('/books/search', { params: { q } });
        return r;
      });
      setBooks(data || []);
      if (!data || data.length === 0) setMsg('No books found');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Search failed');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const goIssue = (bookId) => {
    // navigate to issue page with bookId pre-filled
    nav('/issue', { state: { bookId } });
  };

  return (
    <div className="card">
      <h3>Search Books</h3>

      <div className="small">Search by title, author, serial number or id. Type at least 2 characters.</div>

      <div style={{ marginTop: 8 }}>
        <input
          className="input"
          placeholder="Search books..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      {loading && <div className="small" style={{ marginTop: 8 }}>Searching...</div>}
      {msg && <div className="notice" style={{ marginTop: 8 }}>{msg}</div>}

      {books.length > 0 && (
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Serial</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b._id}>
                <td style={{ maxWidth: 360 }}>
                  <div style={{ fontWeight: 600 }}>{b.title}</div>
                  <div className="small" style={{ marginTop: 4 }}>{b.description || ''}</div>
                </td>
                <td>{b.author}</td>
                <td>{b.serialNo || '-'}</td>
                <td>{b.availableCount != null ? b.availableCount : (b.isAvailable ? 'Yes' : 'No')}</td>
                <td>
                  <button className="btn" onClick={() => goIssue(b._id)}>Issue</button>
                  {user?.isAdmin && (
                    <>
                      <Link to={`/update-book/${b._id}`} className="btn" style={{ marginLeft: 6 }}>Edit</Link>
                      <Link to="/add-book" className="btn" style={{ marginLeft: 6 }}>Add copy</Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}