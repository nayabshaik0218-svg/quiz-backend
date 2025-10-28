const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Add a new question
router.post('/', async (req, res) => {
  const { q, choices, answer, topic } = req.body;
  try {
    const newQuestion = new Question({ q, choices, answer, topic });
    await newQuestion.save();
    res.status(201).json({ message: 'Question added', question: newQuestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

