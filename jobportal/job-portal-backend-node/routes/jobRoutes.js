// Job Routes - API endpoints for job operations

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/auth');

// Public Routes (No authentication required)
// Get all jobs
router.get('/', jobController.getAllJobs);

// Protected Routes (Authentication required)
// Get all jobs by employer - MUST be before /:id to avoid route conflict
router.get('/employer/all', authMiddleware, jobController.getEmployerJobs);

// Get job by ID
router.get('/:id', jobController.getJobById);

// Create a new job (Employer only)
router.post('/', authMiddleware, jobController.createJob);

// Update a job (Employer only)
router.put('/:id', authMiddleware, jobController.updateJob);

// Delete a job (Employer only)
router.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = router;
