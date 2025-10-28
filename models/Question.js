const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  topic: { type: String, default: 'General', trim: true },
  question: { type: String, required: true, trim: true },
  choices: { type: [String], required: true },
  answer: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

QuestionSchema.index({ topic: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
