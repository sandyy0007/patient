const Prescription = require('../models/Prescription');

// @desc    Get prescriptions (role-aware)
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res, next) => {
  try {
    let prescriptions;
    if (req.user.role === 'patient') {
      prescriptions = await Prescription.find({ patient: req.user.id })
        .populate('doctor', 'name email specialization')
        .populate('appointment', 'date timeSlot status')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'doctor') {
      prescriptions = await Prescription.find({ doctor: req.user.id })
        .populate('patient', 'name email age medicalHistory')
        .populate('appointment', 'date timeSlot status')
        .sort({ createdAt: -1 });
    } else { // admin
      prescriptions = await Prescription.find()
        .populate('doctor', 'name')
        .populate('patient', 'name')
        .sort({ createdAt: -1 });
    }
    res.status(200).json(prescriptions);
  } catch (error) {
    next(error);
  }
};

// @desc    Create prescription (doctor only)
// @route   POST /api/prescriptions
// @access  Private (Doctor)
const createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, medications, notes } = req.body;

    if (!appointmentId || !medications || !medications.length === 0) {
      res.status(400);
      throw new Error('Appointment ID and medications required');
    }

    // Check if doctor owns the appointment
    const appointment = await require('../models/Appointment').findById(appointmentId).populate('doctor');
    if (appointment.doctor._id.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Can only prescribe for your appointments');
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: req.user.id,
      patient: appointment.patient,
      medications,
      notes
    });

    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor/Admin)
const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('doctor');

    if (!prescription) {
      res.status(404);
      throw new Error('Prescription not found');
    }

    // Auth check
    if (req.user.role !== 'admin' && prescription.doctor._id.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const updated = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('doctor', 'name')
      .populate('patient', 'name');

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private (Doctor/Admin)
const deletePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      res.status(404);
      throw new Error('Prescription not found');
    }

    if (req.user.role !== 'admin' && prescription.doctor.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await Prescription.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
};
