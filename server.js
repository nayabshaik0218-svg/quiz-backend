// server.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Default allowed origins (you can add more here)
const DEFAULT_ORIGINS = [
  "https://quiz-frontend-je9pf40rp-nayabshaik0218-svgs-projects.vercel.app",
  "https://quiz-frontend-amber-nu.vercel.app",
  "https://quiz-frontend-owct8ed66-nayabshaik0218-svgs-projects.vercel.app"
];

// Allow overriding with env (comma separated)
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(",").map(s => s.trim()).filter(Boolean)
  : DEFAULT_ORIGINS;

console.log("Allowed frontend origins:", FRONTEND_ORIGINS);

const corsOptions = {
  origin: function (origin, callback) {
    // If no origin (curl, server-side) allow it
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // Not allowed
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

// Respond to preflight early
app.options("*", cors(corsOptions));

// Security middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Helpful debug headers + ensure CORS headers always exist on responses
app.use((req, res, next) => {
  const origin = req.get("Origin") || req.get("origin");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Origin: ${origin || "none"}`);

  // If origin is allowed, explicitly echo it back (required when credentials: true)
  if (origin && FRONTEND_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, X-Requested-With, X-Vercel-Id, X-Vercel-Bypass-Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Basic health route
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

// Example API
app.get("/api/questions", (req, res) => {
  // NOTE: If Vercel Protection / SSO is enabled for this deployment,
  // the request may be intercepted before this handler runs.
  const questions = [
    {
      topic: "Math",
      question: "What is 2 + 2?",
      choices: ["3", "4", "5", "6"],
      answer: "4",
    },
    // add more questions as needed
  ];
  res.json(questions);
});

// Optional: expose a small endpoint that Vercel's default page sometimes polls
// (not required, but helpful if you saw client code fetching it)
app.get("/.well-known/vercel-user-meta", (req, res) => {
  // Return 404 if not set by Vercel. This just avoids noisy errors in some setups.
  res.status(404).send("not-found");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

