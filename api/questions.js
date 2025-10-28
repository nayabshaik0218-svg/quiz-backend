export default function handler(req, res) {
  // Add these headers for CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return quiz questions as JSON
  res.status(200).json([
    {
      topic: "Math",
      question: "What is 2 + 2?",
      choices: ["3", "4", "5", "6"],
      answer: "4",
    },
    {
      topic: "Science",
      question: "What gas do plants absorb from the atmosphere?",
      choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      answer: "Carbon Dioxide",
    },
    {
      topic: "Geography",
      question: "What is the capital of France?",
      choices: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: "Paris",
    },
    {
      topic: "History",
      question: "Who was the first President of the United States?",
      choices: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
      answer: "George Washington",
    },
    {
      topic: "Technology",
      question: "What does CPU stand for?",
      choices: [
        "Central Process Unit",
        "Computer Personal Unit",
        "Central Processing Unit",
        "Control Processing Unit",
      ],
      answer: "Central Processing Unit",
    },
    {
      topic: "Sports",
      question: "Which sport is known as the ‘king of sports’?",
      choices: ["Basketball", "Cricket", "Soccer", "Tennis"],
      answer: "Soccer",
    },
    {
      topic: "Literature",
      question: "Who wrote 'Romeo and Juliet'?",
      choices: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
      answer: "William Shakespeare",
    },
    {
      topic: "Music",
      question: "Which instrument has keys, pedals, and strings?",
      choices: ["Piano", "Guitar", "Violin", "Saxophone"],
      answer: "Piano",
    },
    {
      topic: "Science",
      question: "What is the boiling point of water at sea level in Celsius?",
      choices: ["100°C", "90°C", "80°C", "110°C"],
      answer: "100°C",
    },
    {
      topic: "Math",
      question: "What is the square root of 64?",
      choices: ["6", "7", "8", "9"],
      answer: "8",
    },
  ]);
}
