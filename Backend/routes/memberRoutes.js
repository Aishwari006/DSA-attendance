const express = require('express');
const Member = require('../models/Member');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(
      members.map((doc) => ({
        ...doc.toObject(),
        id: doc._id.toString(),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json({
      ...member.toObject(),
      id: member._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;