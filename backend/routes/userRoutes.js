const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getPatients,
  updateProfile,
  approveDoctor,
  deleteUser,
  getAnalytics,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/doctors', getDoctors);
router.get('/patients', protect, authorize('admin', 'doctor'), getPatients);
router.put('/profile', protect, updateProfile);
router.put('/doctors/:id/approve', protect, authorize('admin'), approveDoctor);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
