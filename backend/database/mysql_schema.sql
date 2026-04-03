-- Doctor-Patient Management System MySQL Schema
-- Run: mysql -u root -p doctor_patient_db < mysql_schema.sql

CREATE DATABASE IF NOT EXISTS doctor_patient_db;
USE doctor_patient_db;

-- Users table (matches Mongoose User model)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed with bcrypt
  role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
  age INT,
  gender ENUM('male', 'female', 'other'),
  specialization VARCHAR(100), -- for doctors
  medicalHistory TEXT, -- for patients
  isApproved BOOLEAN DEFAULT FALSE, -- for doctors
  location VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  doctorId INT NOT NULL,
  date DATE NOT NULL,
  timeSlot VARCHAR(20) NOT NULL, -- e.g. '10:00 AM'
  status ENUM('pending', 'confirmed', 'rejected', 'completed') DEFAULT 'pending',
  symptoms TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_patient_date (patientId, date),
  INDEX idx_doctor_slot (doctorId, date, timeSlot)
);

-- Prescriptions table
CREATE TABLE prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  doctorId INT NOT NULL,
  appointmentId INT,
  medicines JSON NOT NULL, -- [{"name":"Aspirin","dosage":"1/day"}]
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE SET NULL,
  INDEX idx_patient (patientId),
  INDEX idx_doctor (doctorId)
);

-- Messages table (chat)
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  senderId INT NOT NULL,
  receiverId INT NOT NULL,
  roomId VARCHAR(50) NOT NULL, -- e.g. 'patient_doctor_123'
  content TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_room (roomId),
  INDEX idx_receiver_read (receiverId, isRead)
);

-- Indexes for performance
CREATE INDEX idx_users_role_approved ON users(role, isApproved);
CREATE INDEX idx_appointments_status_date ON appointments(status, date);

-- Sample Data (passwords hashed as $2b$10$... for 'password123')
INSERT INTO users (name, email, password, role, age, gender, specialization, isApproved, location) VALUES
('Admin User', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, NULL, NULL, NULL, NULL),
('Dr. John Smith', 'dr.smith@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', 45, 'male', 'Cardiology', true, 'New York'),
('Dr. Sarah Johnson', 'dr.johnson@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', 38, 'female', 'Neurology', true, 'Los Angeles'),
('Jane Doe', 'jane@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', 30, 'female', NULL, NULL, 'New York'),
('Bob Wilson', 'bob@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', 42, 'male', NULL, NULL, 'Los Angeles');

-- Sample appointments
INSERT INTO appointments (patientId, doctorId, date, timeSlot, status, symptoms) VALUES
(4, 2, '2024-04-10', '10:00 AM', 'confirmed', 'Chest pain'),
(5, 3, '2024-04-15', '14:00', 'pending', 'Headaches');

-- Sample prescriptions
INSERT INTO prescriptions (patientId, doctorId, appointmentId, medicines, notes) VALUES
(4, 2, 1, '[{"name":"Aspirin","dosage":"100mg daily"},{"name":"Metoprolol","dosage":"50mg daily"}]', 'Take with food, follow up in 2 weeks'),
(5, 3, 2, '[{"name":"Ibuprofen","dosage":"400mg as needed"}]', 'For headache relief');

-- Sample messages
INSERT INTO messages (senderId, receiverId, roomId, content) VALUES
(2, 4, 'doctor_patient_24', 'Hi Jane, your test results are ready.'),
(4, 2, 'doctor_patient_24', 'Thank you doctor!');

SELECT 'Database created successfully with 5 users, 2 appointments, 2 prescriptions, 2 messages' as status;

-- Usage:
-- mysql -u root -p < mysql_schema.sql
-- Then update .env DB_HOST etc for MySQL adapter if switching from MongoDB.
