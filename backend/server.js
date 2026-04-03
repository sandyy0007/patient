require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Connect DB
connectDB();

// Security middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // limit each IP to 100 req per windowMs
});
app.use(limiter);

// Body parser
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Socket auth & rooms
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    socket.user = decoded.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.user} connected`);

  // Join user room
  socket.join(socket.user);

  // Chat rooms
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('notification', { message: 'User joined room' });
  });

  socket.on('sendMessage', (data) => {
    io.to(data.roomId).emit('newMessage', data);
  });

  socket.on('appointmentUpdate', (data) => {
    // Notify patient/doctor
    socket.to(data.patient).emit('appointmentUpdated', data);
    socket.to(data.doctor).emit('appointmentUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.user} disconnected`);
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server & Socket.IO started on port ${PORT}`);
  console.log(`Socket connection test: http://localhost:${PORT}`);
});

module.exports = { io };
