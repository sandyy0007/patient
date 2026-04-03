const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    roomId: {
      type: String, // patientId_doctorId
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Index for room queries
messageSchema.index({ roomId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
