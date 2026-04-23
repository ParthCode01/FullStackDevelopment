  import React from 'react';
  import { Link } from 'react-router-dom';
  import './Home.css';

  export default function Home() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    return (
      <div className="home">
        <section className="hero">
          <h1>Welcome to Job Portal</h1>
          <p>Find your perfect job or hire the right talent</p>
          {!token && <Link to="/register" className="btn btn-blue" style={{ fontSize: '1.1rem', padding: '0.9rem 2rem' }}>Get Started</Link>}
          {token && role === 'job_seeker' && <Link to="/jobs" className="btn btn-blue" style={{ fontSize: '1.1rem', padding: '0.9rem 2rem' }}>Browse Jobs</Link>}
          {token && role === 'employer' && <Link to="/post-job" className="btn btn-blue" style={{ fontSize: '1.1rem', padding: '0.9rem 2rem' }}>Post a Job</Link>}
        </section>

        <section className="features">
          <h2>How It Works</h2>
          <div className="cards">
            <div className="card">
              <div className="icon">👤</div>
              <h3>For Job Seekers</h3>
              <ul>
                <li>Create an account</li>
                <li>Browse and search jobs</li>
                <li>Apply with cover letter</li>
                <li>Track your applications</li>
              </ul>
            </div>
            <div className="card">
              <div className="icon">🏢</div>
              <h3>For Employers</h3>
              <ul>
                <li>Post job openings</li>
                <li>Review applications</li>
                <li>Update application status</li>
                <li>Manage your listings</li>
              </ul>
            </div>
          </div>
        </section>

        {!token && (
          <section className="cta">
            <h2>Ready to get started?</h2>
            <Link to="/login" className="btn btn-grey" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register" className="btn btn-blue">Register Now</Link>
          </section>
        )}
      </div>
    );
  }
