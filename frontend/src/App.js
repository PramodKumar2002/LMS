import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SearchBooks from './pages/SearchBooks';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';
import Membership from './pages/Membership';
import Users from './pages/Users';
import Maintenance from './pages/Maintenance';
import PrivateRoute from './components/PrivateRoute';

export default function App(){
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch { return null; }
  });

  useEffect(()=> {
    const u = localStorage.getItem('user');
    if(u) setUser(JSON.parse(u));
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        {user && <NavBar user={user} setUser={setUser} />}
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
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
    </BrowserRouter>
  );
}
