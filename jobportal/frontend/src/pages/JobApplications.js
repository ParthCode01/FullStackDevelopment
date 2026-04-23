import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, getJobApplications, updateApplicationStatus } from '../api';
import './Applications.css';

export default function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([getJobById(jobId), getJobApplications(jobId)]);
        setJob(jobRes.data.job);
        setApplications(appsRes.data.applications || []);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>Applications for: {job?.title}</h1>
        <p>{job?.company} — {job?.location}</p>
      </div>
      <div className="apps-container">
        <button className="btn btn-grey" style={{ marginBottom: '1rem' }} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        {error && <div className="error-message">{error}</div>}
        {applications.length > 0 ? (
          <>
            <p className="count">{applications.length} application(s) received</p>
            {applications.map(app => (
              <div key={app.id} className="app-card">
                <div className="app-header">
                  <h3>{app.applicant_name}</h3>
                  <span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span>
                </div>
                <p><strong>Email:</strong> {app.applicant_email}</p>
                <p><strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
                <div className="cover-letter">
                  <strong>Cover Letter:</strong>
                  <p>{app.cover_letter}</p>
                </div>
                {app.resume_path && (
                  <a href={`http://localhost:5000${app.resume_path}`} target="_blank" rel="noopener noreferrer" className="btn btn-blue" style={{ marginBottom: '0.75rem' }}>
                    Download Resume
                  </a>
                )}
                <div style={{ marginTop: '0.75rem' }}>
                  <label><strong>Update Status:</strong></label>
                  <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.4rem', borderRadius: '4px' }}>
                    <option value="Applied">Applied</option>
                    <option value="Reviewed">Reviewed</option>
                  </select>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="no-apps">
            <p>No applications received yet for this job</p>
          </div>
        )}
      </div>
    </div>
  );
}
