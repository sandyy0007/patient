const Appointment = require('../models/Appointment');

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    let appointments;
    if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name email specialization');
    } else if (req.user.role === 'doctor') {
      appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'name email age medicalHistory');
    } else {
      appointments = await Appointment.find().populate('doctor', 'name').populate('patient', 'name');
    }
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private (Patient only ideally)
const setAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;

    if (!doctorId || !date || !timeSlot) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    // Check doctor availability - simple check: no other pending/completed appts in slot
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'accepted', 'completed'] }
    });

    if (existing) {
      res.status(400);
      throw new Error('Doctor not available in this time slot');
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      timeSlot,
      symptoms
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    // Checking if the user has permission to update
    if (
      req.user.role !== 'admin' &&
      appointment.doctor.toString() !== req.user.id &&
      appointment.patient.toString() !== req.user.id
    ) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedAppointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user.id
    ) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await appointment.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  setAppointment,
  updateAppointment,
  deleteAppointment,
};
