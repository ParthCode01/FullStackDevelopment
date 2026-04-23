import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmployerJobs, deleteJob } from '../api';
import JobCard from '../components/JobCard';
import './Dashboard.css';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getEmployerJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      alert('Job deleted');
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1>Employer Dashboard</h1>
          <p>Manage your job postings</p>
        </div>
        <Link to="/post-job" className="btn btn-blue">+ Post New Job</Link>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-num">{jobs.length}</div>
          <div className="stat-label">Jobs Posted</div>
        </div>
      </div>

      <div className="jobs-section">
        <h2>Your Job Postings</h2>
        {error && <div className="error-message">{error}</div>}
        {jobs.length > 0 ? (
          jobs.map(job => <JobCard key={job.id} job={job} onDelete={handleDelete} isEmployer />)
        ) : (
          <div className="no-jobs">
            <p>No jobs posted yet</p>
            <Link to="/post-job" className="btn btn-blue">Post Your First Job</Link>
          </div>
        )}
      </div>
    </div>
  );
}
