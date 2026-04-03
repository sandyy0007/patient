const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/:roomId', getMessages);
router.get('/unread', getUnreadCount);

module.exports = router;
