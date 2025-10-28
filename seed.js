require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const Question = require('./models/Question');

const DATA_FILE = path.join(__dirname, 'data', 'questions.json');

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const json = JSON.parse(raw);

  let inserted = 0;
  for (const item of json) {
    const doc = {
      topic: item.topic || item.t || 'General',
      question: item.question || item.q || '',
      choices: item.choices || item.opts || [],
      answer: item.answer || item.a || ''
    };
    if (!doc.question || !Array.isArray(doc.choices) || doc.choices.length === 0) {
      console.warn('Skipping invalid question:', item);
      continue;
    }
    await Question.findOneAndUpdate(
      { question: doc.question },
      doc,
      { upsert: true, new: true }
    );
    inserted++;
  }
  console.log(`Seeded ${inserted} questions`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed', err);
  process.exit(1);
});
