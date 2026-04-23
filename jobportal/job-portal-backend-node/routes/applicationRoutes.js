// Application Routes - API endpoints for job applications

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

// Apply for a job
router.post('/apply', upload.single('resume'), applicationController.applyForJob);

// Get applications for the current user
router.get('/user', authMiddleware, applicationController.getUserApplications);

// Get applications for a job
router.get('/job/:jobId', applicationController.getJobApplications);

// Update application status
router.put('/:appId/status', authMiddleware, applicationController.updateApplicationStatus);

module.exports = router;
