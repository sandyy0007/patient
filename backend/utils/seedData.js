require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doctor-patient-db')
  .then(async () => {
    console.log('Connected to DB for seeding');

    // Clear data
    await Appointment.deleteMany({});
    await User.deleteMany({});

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: 'admin'
    });

    // Doctors
    const doctors = await User.insertMany([
      {
        name: 'Dr. John Smith',
        email: 'dr.smith@example.com',
        password,
        role: 'doctor',
        specialization: 'Cardiology',
        age: 45,
        location: 'New York',
        isApproved: true
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'dr.johnson@example.com',
        password,
        role: 'doctor',
        specialization: 'Neurology',
        age: 38,
        location: 'Los Angeles',
        isApproved: true
      }
    ]);

    // Patients
    const patients = await User.insertMany([
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password,
        role: 'patient',
        age: 30,
        medicalHistory: 'Hypertension, regular checkups',
        location: 'New York'
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        password,
        role: 'patient',
        age: 42,
        medicalHistory: 'Diabetes type 2',
        location: 'Los Angeles'
      }
    ]);

    // Sample appointments
    await Appointment.create([
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        date: new Date('2024-04-10'),
        timeSlot: '10:00 AM',
        status: 'accepted',
        symptoms: 'Chest pain, shortness of breath'
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        date: new Date('2024-04-15'),
        timeSlot: '2:00 PM',
        status: 'pending',
        symptoms: 'Headaches, dizziness'
      }
    ]);

    console.log('Seed data inserted! Admin/Doctor/Patient login: admin@example.com / dr.smith@example.com / jane@example.com | password: password123');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
