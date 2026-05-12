const express = require('express');
const Attendance = require('../models/Attendance');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 1. Removed .populate('memberId')
    const records = await Attendance.find();
    
    res.json(
      records.map((doc) => ({
        ...doc.toObject(),
        id: doc._id.toString(),
        // 2. Force memberId to be a standard string
        memberId: doc.memberId.toString(), 
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { memberId, date } = req.body;

    const existing = await Attendance.findOne({ memberId, date });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date.' });
    }

    const attendance = await Attendance.create({ memberId, date });
    res.status(201).json({
      ...attendance.toObject(),
      id: attendance._id.toString(),
      memberId: attendance.memberId.toString(), // Force string here too
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;