// Application Model - Database operations for applications table

const { pool } = require('../config/db');

// Create a new application
const createApplication = async (appData) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO applications (user_id, job_id, cover_letter, resume_path, status, applied_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [
        appData.user_id,
        appData.job_id,
        appData.cover_letter,
        appData.resume_path || null,
        'Applied',
      ]
    );
    return result;
  } finally {
    connection.release();
  }
};

// Get all applications by user
const getApplicationsByUserId = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [applications] = await connection.query(
      `SELECT a.*, j.title as job_title, j.company as company_name, j.location 
       FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE a.user_id = ? 
       ORDER BY a.applied_at DESC`,
      [userId]
    );
    return applications;
  } finally {
    connection.release();
  }
};

// Get all applications for a job
const getApplicationsByJobId = async (jobId) => {
  const connection = await pool.getConnection();
  try {
    const [applications] = await connection.query(
      `SELECT a.*, u.name as applicant_name, u.email as applicant_email 
       FROM applications a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.job_id = ? 
       ORDER BY a.applied_at DESC`,
      [jobId]
    );
    return applications;
  } finally {
    connection.release();
  }
};

// Update application status
const updateApplicationStatus = async (applicationId, status) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, applicationId]
    );
    return result;
  } finally {
    connection.release();
  }
};

module.exports = {
  createApplication,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplicationStatus,
};
