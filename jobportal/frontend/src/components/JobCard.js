import React from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

export default function JobCard({ job, onDelete, isEmployer }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p className="company">{job.company}</p>
      <div className="details">
        <span>📍 {job.location}</span>
        <span>💰 ₹{Number(job.salary).toLocaleString('en-IN')}</span>
      </div>
      <p className="description">
        {job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
      </p>
      <div className="actions">
        {!isEmployer && <Link to={`/job/${job.id}`} className="btn btn-blue">View & Apply</Link>}
        {isEmployer && (
          <>
            <Link to={`/edit-job/${job.id}`} className="btn btn-orange">Edit</Link>
            <Link to={`/job-applications/${job.id}`} className="btn btn-green">Applications</Link>
            <button onClick={() => onDelete(job.id)} className="btn btn-red">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
