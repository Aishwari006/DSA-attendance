const express = require('express');
const cors = require('cors');

const memberRoutes = require('./routes/memberRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DSA Attendance API is running.' });
});

// Routes
app.use('/api/users', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/questions', questionRoutes);

module.exports = app;