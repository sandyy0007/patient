const express = require('express');
const router = express.Router();
const {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Role-based access
router.use(protect);

router.route('/')
  .get(getPrescriptions)
  .post(authorize('doctor'), createPrescription);

router.route('/:id')
  .put(authorize('doctor', 'admin'), updatePrescription)
  .delete(authorize('doctor', 'admin'), deletePrescription);

module.exports = router;
