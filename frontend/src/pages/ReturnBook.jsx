import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ReturnBook() {
  const [transactions, setTransactions] = useState([]);
  const [msg, setMsg] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(()=> {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get('/transactions/my');
    setTransactions(data);
  };

  const onReturn = async (tx) => {
    setMsg('');
    // ask for actual return date - use today
    try {
      const actualDate = new Date().toISOString();
      const res = await api.post('/transactions/return', { transactionId: tx._id, actualReturnDate: actualDate, finePaid: true });
      setMsg(res.data.message + (res.data.fine ? ` Fine: ₹${res.data.fine}` : ''));
      await load();
    } catch(err) {
      // If fine pending, backend returns 400 with fine amount
      const fine = err.response?.data?.fine;
      if(fine) {
        // require user to pay fine (checkbox step). In UI, we prompt confirm payment:
        if(window.confirm(`Fine ₹${fine} is pending. Mark as paid and complete return?`)) {
          try {
            const res2 = await api.post('/transactions/return', { transactionId: tx._id, actualReturnDate: new Date().toISOString(), finePaid: true });
            setMsg(res2.data.message + (res2.data.fine ? ` Fine: ₹${res2.data.fine}` : ''));
            await load();
          } catch(e) {
            setMsg(e.response?.data?.message || 'Error');
          }
        } else {
          setMsg('Return aborted: fine unpaid');
        }
      } else {
        setMsg(err.response?.data?.message || 'Error returning');
      }
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Your transactions</h3>
        {msg && <div className="notice">{msg}</div>}
        <table className="table">
          <thead><tr><th>Title</th><th>Issue</th><th>Due</th><th>Returned</th><th>Fine</th><th>Action</th></tr></thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td>{tx.book?.title}</td>
                <td>{new Date(tx.issueDate).toLocaleDateString()}</td>
                <td>{new Date(tx.returnDate).toLocaleDateString()}</td>
                <td>{tx.actualReturnDate ? new Date(tx.actualReturnDate).toLocaleDateString() : 'Not returned'}</td>
                <td>{tx.fineAmount ? `₹${tx.fineAmount}` : '-'}</td>
                <td>
                  {!tx.actualReturnDate && <button className="btn" onClick={()=>onReturn(tx)}>Return</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
