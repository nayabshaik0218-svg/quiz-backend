const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    server: "quiz-backend",
    project: process.env.PROJECT_ID || "unknown",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.type("html").send(`
    <html>
      <head><title>Quiz App Backend</title></head>
      <body style="font-family:system-ui,Arial;padding:2rem;">
        <h1>Quiz App Backend</h1>
        <p>Health: <a href="/health">/health</a></p>
        <p>Questions endpoint (GET): <code>/api/questions</code></p>
      </body>
    </html>
  `);
});

// API Endpoint to fetch static quiz questions
app.get("/api/questions", (req, res) => {
  const questions = [
    {
      topic: "Math",
      question: "What is 2 + 2?",
      choices: ["3", "4", "5", "6"],
      answer: "4",
    },
    {
      topic: "Science",
      question: "Water's chemical formula?",
      choices: ["H2O", "CO2", "O2", "H2"],
      answer: "H2O",
    },
    {
      topic: "Tech",
      question: "What does CPU stand for?",
      choices: [
        "Central Process Unit",
        "Computer Personal Unit",
        "Central Processing Unit",
        "Control Processing Unit",
      ],
      answer: "Central Processing Unit",
    },
  ];
  res.json(questions);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

