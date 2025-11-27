import React, { useState } from 'react';
import api from '../api';

export default function SearchBook({ user }) {
  const [serial, setSerial] = useState('');
  const [book, setBook] = useState(null);
  const [activeTx, setActiveTx] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const searchBySerial = async (e) => {
    if (e) e.preventDefault();
    setMsg('');
    setBook(null);
    setActiveTx(null);
    if (!serial?.trim()) return setMsg('Enter a serial number');
    setLoading(true);

    try {
      // try server endpoints in a forgiving order
      const tryEndpoints = [
        () => api.get('/books/serial', { params: { serialNo: serial.trim() } }), // preferred
        () => api.get('/books', { params: { q: serial.trim() } }),            // generic search
        () => api.get('/books/search', { params: { q: serial.trim() } }),     // fallback
      ];

      let res;
      for (const call of tryEndpoints) {
        try {
          res = await call();
          if (res?.data) break;
        } catch (_e) { /* continue */ }
      }

      if (!res || !res.data) {
        setMsg('Book not found');
        setLoading(false);
        return;
      }

      // handle both single-item and array results
      const found = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!found) {
        setMsg('Book not found');
        setLoading(false);
        return;
      }

      setBook(found);

      // find active transaction for this book (if any)
      let tx;
      try {
        // try common endpoints that might exist on server
        const txTry = [
          () => api.get('/transactions/active', { params: { bookId: found._id } }),
          () => api.get('/transactions', { params: { bookId: found._id } }),
          () => api.get(`/transactions/book/${found._id}`),
          () => api.get('/transactions/book', { params: { bookId: found._id } })
        ];
        let txRes;
        for (const call of txTry) {
          try {
            txRes = await call();
            if (txRes?.data) break;
          } catch (_e) {}
        }
        const txData = txRes?.data;
        if (Array.isArray(txData)) tx = txData.find(t => !t.actualReturnDate) || txData[0];
        else tx = txData;
      } catch (_e) {
        tx = null;
      }

      if (tx && !tx.actualReturnDate) setActiveTx(tx);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMsg(err.response?.data?.message || 'Search failed');
    }
  };

  const onReturn = async (tx) => {
    setMsg('');
    try {
      const actualDate = new Date().toISOString();
      const resp = await api.post('/transactions/return', { transactionId: tx._id, actualReturnDate: actualDate, finePaid: true });
      setMsg(resp.data.message + (resp.data.fine ? ` Fine: ₹${resp.data.fine}` : ''));
      // update activeTx
      setActiveTx(null);
    } catch (err) {
      const fine = err.response?.data?.fine;
      if (fine) {
        // ask user to confirm paying fine
        if (window.confirm(`Fine ₹${fine} is pending. Mark as paid and complete return?`)) {
          try {
            const resp2 = await api.post('/transactions/return', { transactionId: tx._id, actualReturnDate: new Date().toISOString(), finePaid: true });
            setMsg(resp2.data.message + (resp2.data.fine ? ` Fine: ₹${resp2.data.fine}` : ''));
            setActiveTx(null);
          } catch (e) {
            setMsg(e.response?.data?.message || 'Error returning');
          }
        } else {
          setMsg('Return cancelled: fine unpaid');
        }
      } else {
        setMsg(err.response?.data?.message || 'Error returning book');
      }
    }
  };

  const computeLateFine = (tx) => {
    // prefer backend-provided fine if present
    if (!tx) return null;
    if (tx.fineAmount) return tx.fineAmount;
    // compute approx fine if returnDate present
    if (!tx.returnDate) return null;
    const due = new Date(tx.returnDate);
    const now = new Date();
    if (now <= due) return 0;
    const daysLate = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
    const perDay = 10; // fallback rate if backend doesn't give amount
    return daysLate * perDay;
  };

  return (
    <div className="card">
      <h3>Search Book by Serial</h3>

      <form onSubmit={searchBySerial} style={{ marginTop: 8 }}>
        <label>Serial Number</label>
        <input
          className="input"
          placeholder="Paste serial number or id"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {msg && <div className="notice" style={{ marginTop: 12 }}>{msg}</div>}

      {book && (
        <div style={{ marginTop: 12 }}>
          <h4>Book details</h4>
          <div className="small">Title: {book.title}</div>
          <div className="small">Author: {book.author}</div>
          <div className="small">Serial: {book.serialNo || serial}</div>
          <div className="small">Description: {book.description || '-'}</div>
          <div className="small">Available: {book.availableCount != null ? book.availableCount : (book.isAvailable ? 'Yes' : 'No')}</div>

          {activeTx ? (
            <div style={{ marginTop: 10 }} className="card">
              <h5>Currently Issued</h5>
              <div className="small">Issued to: {activeTx.user?.name || activeTx.userEmail || activeTx.user}</div>
              <div className="small">Issue date: {activeTx.issueDate ? new Date(activeTx.issueDate).toLocaleDateString() : '-'}</div>
              <div className="small">Due date: {activeTx.returnDate ? new Date(activeTx.returnDate).toLocaleDateString() : '-'}</div>
              <div className="small">Returned: {activeTx.actualReturnDate ? new Date(activeTx.actualReturnDate).toLocaleDateString() : 'Not returned'}</div>

              <div className="small" style={{ marginTop: 6 }}>
                Fine: {activeTx.fineAmount != null ? `₹${activeTx.fineAmount}` : `₹${computeLateFine(activeTx) ?? '-'}`}
              </div>

              <div style={{ marginTop: 8 }}>
                <button className="btn" onClick={() => onReturn(activeTx)}>Return Book</button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 8 }} className="small">This copy is not currently issued.</div>
          )}
        </div>
      )}
    </div>
  );
}