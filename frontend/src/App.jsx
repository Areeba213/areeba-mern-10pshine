import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const handleLogin = (userData, token) => {
    setCurrentUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route 
            path="/dashboard" 
            element={
              currentUser ? (
                <Dashboard 
                  user={currentUser} 
                  onUpdateUser={handleUpdateUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              currentUser ? (
                <Profile 
                  user={currentUser} 
                  onUpdateUser={handleUpdateUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              currentUser ? (
                <Settings />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;