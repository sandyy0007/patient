const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  validateRequest
], registerUser);
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validateRequest
], loginUser);
router.get('/me', protect, getMe);

module.exports = router;
