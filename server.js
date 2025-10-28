const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set your frontend origin in env, fallback to this value:
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ||
  "https://quiz-frontend-je9pf40rp-nayabshaik0218-svgs-projects.vercel.app";

// CORS options
const corsOptions = {
  origin: FRONTEND_ORIGIN,             // exact origin (don't use '*' if credentials:true)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "X-Forwarded-Proto",
    "X-Vercel-Id",
    "X-Vercel-Bypass-Token"
  ],
  credentials: true,                  // allow cookies / credentialed requests
  optionsSuccessStatus: 204
};

// IMPORTANT: respond to preflight for all routes before other logic
app.options("*", cors(corsOptions));

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Safety: ensure the CORS headers are always present (helps debugging)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    server: "quiz-backend",
    project: process.env.PROJECT_ID || "unknown",
  });
});

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

app.get("/api/questions", (req, res) => {
  const questions = [
    {
      topic: "Math",
      question: "What is 2 + 2?",
      choices: ["3", "4", "5", "6"],
      answer: "4",
    },
    // ... other questions
  ];
  res.json(questions);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed origin: ${FRONTEND_ORIGIN}`);
});

