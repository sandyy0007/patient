const express = require('express');
const router = express.Router();
const { symptomChecker } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/symptom-checker', protect, symptomChecker);

module.exports = router;

