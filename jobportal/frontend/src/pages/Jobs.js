import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../api';
import JobCard from '../components/JobCard';
import './Jobs.css';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res.data.jobs || []);
        setFiltered(res.data.jobs || []);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = () => {
    const result = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      job.location.toLowerCase().includes(searchLocation.toLowerCase())
    );
    setFiltered(result);
  };

  const clearFilters = () => {
    setSearchTitle('');
    setSearchLocation('');
    setFiltered(jobs);
  };

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div className="jobs-page">
      <div className="page-header">
        <h1>Find Your Next Job</h1>
        <p>Browse all available opportunities</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input type="text" placeholder="Job title..." value={searchTitle} onChange={e => setSearchTitle(e.target.value)} />
          <input type="text" placeholder="Location..." value={searchLocation} onChange={e => setSearchLocation(e.target.value)} />
          <button onClick={handleSearch} className="btn btn-blue">Search</button>
          <button onClick={clearFilters} className="btn btn-grey">Clear</button>
        </div>
      </div>

      <div className="jobs-container">
        {error && <div className="error-message">{error}</div>}
        {filtered.length > 0 ? (
          <>
            <p className="count">{filtered.length} job(s) found</p>
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </>
        ) : (
          <div className="no-jobs">
            <p>No jobs found</p>
            <button onClick={clearFilters} className="btn btn-blue">View All Jobs</button>
          </div>
        )}
      </div>
    </div>
  );
}
