// Job Model - Database operations for jobs table

const { pool } = require('../config/db');

// Get all jobs
const getAllJobs = async () => {
  const connection = await pool.getConnection();
  try {
    const [jobs] = await connection.query(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    );
    return jobs;
  } finally {
    connection.release();
  }
};

// Get job by ID
const getJobById = async (jobId) => {
  const connection = await pool.getConnection();
  try {
    const [jobs] = await connection.query(
      'SELECT * FROM jobs WHERE id = ?',
      [jobId]
    );
    return jobs[0];
  } finally {
    connection.release();
  }
};

// Get all jobs by employer
const getJobsByEmployerId = async (employerId) => {
  const connection = await pool.getConnection();
  try {
    const [jobs] = await connection.query(
      'SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC',
      [employerId]
    );
    return jobs;
  } finally {
    connection.release();
  }
};

// Create a new job
const createJob = async (jobData) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO jobs (title, company, location, salary, description, employer_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [
        jobData.title,
        jobData.company,
        jobData.location,
        jobData.salary,
        jobData.description,
        jobData.employer_id,
      ]
    );
    return result;
  } finally {
    connection.release();
  }
};

// Update a job
const updateJob = async (jobId, jobData) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'UPDATE jobs SET title = ?, company = ?, location = ?, salary = ?, description = ? WHERE id = ?',
      [
        jobData.title,
        jobData.company,
        jobData.location,
        jobData.salary,
        jobData.description,
        jobId,
      ]
    );
    return result;
  } finally {
    connection.release();
  }
};

// Delete a job
const deleteJob = async (jobId) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'DELETE FROM jobs WHERE id = ?',
      [jobId]
    );
    return result;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  getJobsByEmployerId,
  createJob,
  updateJob,
  deleteJob,
};
