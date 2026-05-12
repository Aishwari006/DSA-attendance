const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().populate('addedBy');
    res.json(
      questions.map((doc) => ({
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
    const question = await Question.create(req.body);
    res.status(201).json({
      ...question.toObject(),
      id: question._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({
      ...updated.toObject(),
      id: updated._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;