const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appointment',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    medications: [
      {
        name: String,
        dosage: String,
        duration: String,
      }
    ],
    notes: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
