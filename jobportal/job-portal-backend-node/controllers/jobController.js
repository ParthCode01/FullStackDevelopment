// Job Controller - Business logic for job operations

const jobModel = require('../models/jobModel');

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.getAllJobs();
    res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      jobs,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobModel.getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job fetched successfully',
      job,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message,
    });
  }
};

// Get jobs by employer
const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.userId; // From auth middleware
    const jobs = await jobModel.getJobsByEmployerId(employerId);

    res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      jobs,
    });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    });
  }
};

// Create a new job
const createJob = async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body;
    const employerId = req.userId; // From auth middleware

    // Validation
    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const jobData = {
      title,
      company,
      location,
      salary,
      description,
      employer_id: employerId,
    };

    const result = await jobModel.createJob(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      jobId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message,
    });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, salary, description } = req.body;
    const employerId = req.userId; // From auth middleware

    // Validation
    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if job belongs to the employer
    const job = await jobModel.getJobById(id);
    if (job.employer_id !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this job',
      });
    }

    const jobData = {
      title,
      company,
      location,
      salary,
      description,
    };

    await jobModel.updateJob(id, jobData);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message,
    });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.userId; // From auth middleware

    // Check if job belongs to the employer
    const job = await jobModel.getJobById(id);
    if (job.employer_id !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this job',
      });
    }

    await jobModel.deleteJob(id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message,
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  getEmployerJobs,
  createJob,
  updateJob,
  deleteJob,
};
