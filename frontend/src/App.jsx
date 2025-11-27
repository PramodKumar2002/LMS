import './App.css';

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SearchBooks from './pages/SearchBooks.jsx';
import IssueBook from './pages/IssueBook.jsx';
import ReturnBook from './pages/ReturnBook.jsx';
import AddBook from './pages/AddBook.jsx';
import UpdateBook from './pages/UpdateBook.jsx';
import Membership from './pages/Membership.jsx';
import Users from './pages/Users.jsx';
import Maintenance from './pages/Maintenance.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch { 
      return null; 
    }
  });

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {user && <NavBar user={user} setUser={setUser} />}
        
        <div className="content-wrapper">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            
            <Route path="/" element={<PrivateRoute><Dashboard user={user} /></PrivateRoute>} />
            <Route path="/search" element={<PrivateRoute><SearchBooks user={user} /></PrivateRoute>} />
            <Route path="/issue" element={<PrivateRoute><IssueBook user={user} /></PrivateRoute>} />
            <Route path="/return" element={<PrivateRoute><ReturnBook user={user} /></PrivateRoute>} />
            <Route path="/add-book" element={<PrivateRoute><AddBook user={user} /></PrivateRoute>} />
            <Route path="/update-book/:id" element={<PrivateRoute><UpdateBook user={user} /></PrivateRoute>} />
            <Route path="/membership" element={<PrivateRoute><Membership user={user} /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users user={user} /></PrivateRoute>} />
            <Route path="/maintenance" element={<PrivateRoute><Maintenance user={user} /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
