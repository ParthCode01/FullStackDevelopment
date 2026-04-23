import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">💼 Job Portal</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          {token && role === 'job_seeker' && (
            <>
              <Link to="/jobs" className="nav-link">Find Jobs</Link>
              <Link to="/applications" className="nav-link">My Applications</Link>
            </>
          )}

          {token && role === 'employer' && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/post-job" className="nav-link">Post Job</Link>
            </>
          )}

          {token ? (
            <>
              <span className="nav-name">Hi, {name}</span>
              <button onClick={logout} className="nav-link logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link signup-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
