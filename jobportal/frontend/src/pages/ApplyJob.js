import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyForJob } from '../api';
import './ApplyJob.css';

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(jobId);
        setJob(res.data.job);
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) return setError('Cover letter is required');
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('userId'));
    formData.append('job_id', jobId);
    formData.append('cover_letter', coverLetter);
    if (resume) formData.append('resume', resume);

    try {
      await applyForJob(formData);
      alert('Application submitted successfully!');
      navigate('/applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!job) return <div className="error-message">Job not found</div>;

  return (
    <div className="apply-page">
      <div className="page-header">
        <h1>Apply for Job</h1>
      </div>
      <div className="apply-container">
        <div className="job-info">
          <h2>{job.title}</h2>
          <p className="company">{job.company}</p>
          <div className="details">
            <span>📍 {job.location}</span>
            <span>💰 ₹{Number(job.salary).toLocaleString('en-IN')}</span>
          </div>
          <p className="desc">{job.description}</p>
        </div>

        <div className="form-card">
          <h3>Submit Your Application</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Cover Letter *</label>
              <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Why are you interested in this position?" rows="6" required />
            </div>
            <div className="form-group">
              <label>Resume (Optional)</label>
              <input type="file" onChange={e => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" />
              <small>PDF, DOC, DOCX only</small>
            </div>
            <button type="submit" className="btn btn-blue btn-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
