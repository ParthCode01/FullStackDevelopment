import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, updateJob } from '../api';
import './PostJob.css';

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', company: '', location: '', salary: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(jobId);
        const { title, company, location, salary, description } = res.data.job;
        setForm({ title, company, location, salary, description });
      } catch (err) {
        setError('Failed to load job');
      } finally {
        setFetching(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateJob(jobId, form);
      alert('Job updated!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading...</div>;

  return (
    <div className="post-job-page">
      <div className="page-header">
        <h1>Edit Job</h1>
        <p>Update your job posting details</p>
      </div>
      <div className="form-container">
        <div className="form-card">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input name="company" value={form.company} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input name="location" value={form.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Salary (₹ per annum) *</label>
                <input type="number" name="salary" value={form.salary} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Job Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="8" required />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-blue" disabled={loading}>
                {loading ? 'Updating...' : 'Update Job'}
              </button>
              <button type="button" className="btn btn-grey" onClick={() => navigate('/dashboard')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
