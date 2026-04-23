import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api';
import './PostJob.css';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', company: '', location: '', salary: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createJob(form);
      alert('Job posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Create a job posting to find qualified candidates</p>
      </div>
      <div className="form-container">
        <div className="form-card">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g., Senior Developer" required />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="e.g., Tech Corp Inc." required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g., Mumbai, India" required />
              </div>
              <div className="form-group">
                <label>Salary (₹ per annum) *</label>
                <input type="number" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g., 500000" required />
              </div>
            </div>
            <div className="form-group">
              <label>Job Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the job responsibilities and requirements..." rows="8" required />
            </div>
            <button type="submit" className="btn btn-blue btn-full" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
