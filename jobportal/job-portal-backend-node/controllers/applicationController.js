// Application Controller - Business logic for job applications

const applicationModel = require('../models/applicationModel');

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { user_id, job_id, cover_letter } = req.body;
    let resumePath = null;

    // Handle file upload if present
    if (req.file) {
      resumePath = `/uploads/${req.file.filename}`;
    }

    // Validation
    if (!user_id || !job_id || !cover_letter) {
      return res.status(400).json({
        success: false,
        message: 'User ID, Job ID, and Cover Letter are required',
      });
    }

    const appData = {
      user_id,
      job_id,
      cover_letter,
      resume_path: resumePath,
    };

    const result = await applicationModel.createApplication(appData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};

// Get applications for a user
const getUserApplications = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const applications = await applicationModel.getApplicationsByUserId(userId);

    res.status(200).json({
      success: true,
      message: 'Applications fetched successfully',
      applications,
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    });
  }
};

// Get applications for a job (Employer only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await applicationModel.getApplicationsByJobId(jobId);

    res.status(200).json({
      success: true,
      message: 'Applications fetched successfully',
      applications,
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    // Validate status values
    const validStatuses = ['Applied', 'Reviewed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    await applicationModel.updateApplicationStatus(appId, status);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
};
