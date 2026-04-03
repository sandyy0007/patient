const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getDoctors,
  approveDoctor
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
// @access  Private Admin
router.get('/analytics', protect, authorize('admin'), getAnalytics);

// @desc    Get all doctors (for admin approval)
// @route   GET /api/admin/doctors
// @access  Private Admin
router.get('/doctors', protect, authorize('admin'), getDoctors);

// @desc    Approve doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private Admin
router.put('/doctors/:id/approve', [
  body('isApproved').isBoolean().withMessage('isApproved must be boolean'),
  validateRequest
], protect, authorize('admin'), approveDoctor);

module.exports = router;

