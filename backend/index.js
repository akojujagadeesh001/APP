const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_booking', (bookingId) => {
    socket.join(`booking_${bookingId}`);
    console.log(`User joined booking_${bookingId}`);
  });

  socket.on('send_message', (data) => {
    // data: { bookingId, sender, text }
    io.to(`booking_${data.bookingId}`).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth Routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Service Routes
const servicesRouter = require('./routes/services');
app.use('/api/services', servicesRouter);

// Bookings Routes
const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);

// Admin Routes
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

// Payment Routes
const paymentRouter = require('./routes/payment');
app.use('/api/payments', paymentRouter);

// Users Routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
