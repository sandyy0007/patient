const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Existing
const getDoctors = async (req, res, next) => {
  try {
    const { specialization, location } = req.query;
    let query = { role: 'doctor' };
    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (location) query.location = new RegExp(location, 'i');
    
    const doctors = await User.find(query).select('-password');
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

// New: Update profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// New: Admin approve doctor
const approveDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await User.findById(id);
    
    if (!doctor || doctor.role !== 'doctor') {
      res.status(404);
      throw new Error('Doctor not found');
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// New: Admin delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ id });
  } catch (error) {
    next(error);
  }
};

// New: Admin analytics
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor', isApproved: true });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });

    res.status(200).json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      appointmentsThisMonth: await Appointment.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      })
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getPatients,
  updateProfile,
  approveDoctor,
  deleteUser,
  getAnalytics
};

