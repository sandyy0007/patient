const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// @desc    Get admin analytics dashboard data
// @route   GET /api/admin/analytics
// @access  Private Admin
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const pendingDoctors = await User.countDocuments({ role: 'doctor', isApproved: false });
    const totalAppointments = await Appointment.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: new Date(today.getTime() + 24*60*60*1000) }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalPatients,
        pendingDoctors,
        totalAppointments,
        todayAppointments,
        revenue: 0 // Add payments later
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors (for approval)
// @route   GET /api/admin/doctors
// @access  Private Admin
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort('-createdAt');

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private Admin
const approveDoctor = async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    doctor.isApproved = isApproved;
    await doctor.save();

    res.json({
      success: true,
      data: doctor,
      message: `Doctor ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getDoctors,
  approveDoctor
};

