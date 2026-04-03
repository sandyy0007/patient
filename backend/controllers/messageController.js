const Message = require('../models/Message');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, roomId } = req.body;

    if (!receiverId || !content || !roomId) {
      res.status(400);
      throw new Error('Receiver, content, and roomId required');
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      roomId,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages by room
// @route   GET /api/messages/:roomId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 })
      .limit(50); // Last 50 messages

    // Mark as read for receiver
    await Message.updateMany(
      { roomId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread count for user
// @route   GET /api/messages/unread
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getUnreadCount
};
