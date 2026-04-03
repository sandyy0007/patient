const express = require('express');
const router = express.Router();
const {
  getAppointments,
  setAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.route('/')
  .get(protect, getAppointments)
  .post(protect, [
    body('doctorId').isMongoId().withMessage('Valid doctor ID required'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('timeSlot').notEmpty().withMessage('Time slot required'),
    validateRequest
  ], setAppointment);
router.route('/:id').put(protect, updateAppointment).delete(protect, deleteAppointment);

module.exports = router;
