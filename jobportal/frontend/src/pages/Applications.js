import React, { useState, useEffect } from 'react';
import { getUserApplications } from '../api';
import './Applications.css';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await getUserApplications();
        setApplications(res.data.applications || []);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track your job application status</p>
      </div>
      <div className="apps-container">
        {error && <div className="error-message">{error}</div>}
        {applications.length > 0 ? (
          <>
            <p className="count">You have applied to {applications.length} job(s)</p>
            {applications.map(app => (
              <div key={app.id} className="app-card">
                <div className="app-header">
                  <h3>{app.job_title}</h3>
                  <span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span>
                </div>
                <p><strong>Company:</strong> {app.company_name}</p>
                <p><strong>Location:</strong> {app.location}</p>
                <p><strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
                <div className="cover-letter">
                  <strong>Your Cover Letter:</strong>
                  <p>{app.cover_letter}</p>
                </div>
                {app.resume_path && (
                  <a href={`http://localhost:5000${app.resume_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
                    Download Resume
                  </a>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="no-apps">
            <p>You haven't applied to any jobs yet</p>
            <a href="/jobs" className="btn btn-blue">Browse Jobs</a>
          </div>
        )}
      </div>
    </div>
  );
}
