import React from 'react';
import { Link } from 'react-router-dom';

export default function SearchBooks({ user }) {
  return (
    <div>
      <div className="card">
        <h3>Welcome, {user?.name}</h3>
        <div className="small">Role: {user?.isAdmin ? 'Admin' : 'User'}</div>
      </div>

      <div className="row">
        <div className="col card">
          <h4>Books</h4>
          <p className="small">Search and manage book issue/returns.</p>
          <Link className="btn" to="/searchbook">Search Books</Link>
        </div>

        <div className="col card">
          <h4>Membership</h4>
          <p className="small">Add or update membership.</p>
          <Link className="btn" to="/membership">Membership</Link>
        </div>
      </div>

      <div style={{marginTop:12}} className="card">
        <h4>Quick actions</h4>
        <div style={{display:'flex', gap:8}}>
          <Link to="/issue" className="btn">Issue Book</Link>
          <Link to="/return" className="btn">Return Book</Link>
          {user?.isAdmin && <Link to="/add-book" className="btn">Add Book</Link>}
          {user?.isAdmin && <Link to="/maintenance" className="btn">Maintenance</Link>}
        </div>
      </div>
    </div>
  );
}
