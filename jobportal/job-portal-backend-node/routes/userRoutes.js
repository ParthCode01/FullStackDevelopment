// User Routes - API endpoints for user operations

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get user by ID
router.get('/:userId', userController.getUserById);

module.exports = router;
