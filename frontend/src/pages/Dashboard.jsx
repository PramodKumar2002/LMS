import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard({ user }) {
  return (
    <div className="dashboard-container">

      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <span className={`role-badge ${user?.isAdmin ? 'admin' : 'user'}`}>
          {user?.isAdmin ? 'Admin' : 'User'}
        </span>
      </header>

      {/* Cards Section */}
      <section className="dashboard-cards">

        <div className="card">
          <h2>📚 Books</h2>
          <p>Search, issue, and manage books efficiently.</p>
          <Link to="/search" className="btn-gradient">Search Books</Link>
        </div>

        <div className="card">
          <h2>🧑‍🤝‍🧑 Membership</h2>
          <p>Add, update, and manage members easily.</p>
          <Link to="/membership" className="btn-gradient">Manage Members</Link>
        </div>

        <div className="card quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="quick-buttons">
            <Link to="/issue" className="btn-gradient">Issue Book</Link>
            <Link to="/return" className="btn-gradient">Return Book</Link>
            {user?.isAdmin && <Link to="/add-book" className="btn-gradient">Add Book</Link>}
            {user?.isAdmin && <Link to="/maintenance" className="btn-gradient">Maintenance</Link>}
          </div>
        </div>

      </section>

    </div>
  );
}
