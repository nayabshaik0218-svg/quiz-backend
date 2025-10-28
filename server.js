// server.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed frontend origins (env override via FRONTEND_ORIGINS comma-separated)
const DEFAULT_ORIGINS = [
  "https://quiz-frontend-je9pf40rp-nayabshaik0218-svgs-projects.vercel.app",
  "https://quiz-frontend-amber-nu.vercel.app",
  "https://quiz-frontend-owct8ed66-nayabshaik0218-svgs-projects.vercel.app"
];
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(",").map(s => s.trim()).filter(Boolean)
  : DEFAULT_ORIGINS;

console.log("Allowed frontend origins:", FRONTEND_ORIGINS);

// Questions array (from your JSON)
const QUESTIONS = [
  {"topic":"Math","question":"What is 2 + 2?","choices":["3","4","5","6"],"answer":"4"},
  {"topic":"Science","question":"What gas do plants absorb from the atmosphere?","choices":["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"],"answer":"Carbon Dioxide"},
  {"topic":"Geography","question":"What is the capital of France?","choices":["Berlin","Madrid","Paris","Rome"],"answer":"Paris"},
  {"topic":"History","question":"Who was the first President of the United States?","choices":["Abraham Lincoln","George Washington","Thomas Jefferson","John Adams"],"answer":"George Washington"},
  {"topic":"Technology","question":"What does CPU stand for?","choices":["Central Process Unit","Computer Personal Unit","Central Processing Unit","Control Processing Unit"],"answer":"Central Processing Unit"},
  {"topic":"Sports","question":"Which sport is known as the ‘king of sports’?","choices":["Basketball","Cricket","Soccer","Tennis"],"answer":"Soccer"},
  {"topic":"Literature","question":"Who wrote 'Romeo and Juliet'?","choices":["William Shakespeare","Charles Dickens","Mark Twain","Jane Austen"],"answer":"William Shakespeare"},
  {"topic":"Music","question":"Which instrument has keys, pedals, and strings?","choices":["Piano","Guitar","Violin","Saxophone"],"answer":"Piano"},
  {"topic":"Science","question":"What is the boiling point of water at sea level in Celsius?","choices":["100°C","90°C","80°C","110°C"],"answer":"100°C"},
  {"topic":"Math","question":"What is the square root of 64?","choices":["6","7","8","9"],"answer":"8"}
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
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
  credentials: true,
  optionsSuccessStatus: 204
};

app.options("/*", cors(corsOptions));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Debug headers & logs
app.use((req, res, next) => {
  const origin = req.get("Origin") || req.get("origin");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Origin: ${origin || "none"}`);
  if (origin && FRONTEND_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, X-Vercel-Id, X-Vercel-Bypass-Token");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/health", (req, res) => {
  res.json({ ok: true, server: "quiz-backend", project: process.env.PROJECT_ID || "unknown" });
});

app.get("/", (req, res) => {
  res.type("html").send(`<h1>Quiz App Backend</h1><p>GET /api/questions</p>`);
});

// Serve questions
app.get("/api/questions", (req, res) => {
  // If Vercel Deployment Protection is enabled, Vercel may intercept requests
  // and return the SSO page before this handler runs (401). See notes below.
  res.json(QUESTIONS);
});

// small helper commonly probed by Vercel auth UI
app.get("/.well-known/vercel-user-meta", (req, res) => res.status(404).send("not-found"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

