import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import ApplyJob from './pages/ApplyJob';
import Applications from './pages/Applications';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import JobApplications from './pages/JobApplications';
import './App.css';

// Redirects to /login if not logged in, or if wrong role
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Job Seeker */}
            <Route path="/jobs" element={<ProtectedRoute role="job_seeker"><Jobs /></ProtectedRoute>} />
            <Route path="/job/:jobId" element={<ProtectedRoute role="job_seeker"><ApplyJob /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute role="job_seeker"><Applications /></ProtectedRoute>} />

            {/* Employer */}
            <Route path="/dashboard" element={<ProtectedRoute role="employer"><Dashboard /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute role="employer"><PostJob /></ProtectedRoute>} />
            <Route path="/edit-job/:jobId" element={<ProtectedRoute role="employer"><EditJob /></ProtectedRoute>} />
            <Route path="/job-applications/:jobId" element={<ProtectedRoute role="employer"><JobApplications /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2024 Job Portal System</p>
        </footer>
      </div>
    </Router>
  );
}
