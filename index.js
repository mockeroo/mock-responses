const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;

// Load responses from responses/ directory at startup
const responsesDir = path.join(__dirname, 'responses');
const responses = {};
for (const file of fs.readdirSync(responsesDir)) {
  if (!file.endsWith('.json')) continue;
  const code = path.basename(file, '.json');
  responses[code] = JSON.parse(fs.readFileSync(path.join(responsesDir, file), 'utf-8'));
}
const validCodes = Object.keys(responses).map(Number).sort((a, b) => a - b);

// Rate limiter: 120 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => {
    return req.headers['cf-connecting-ip'] || req.ip;
  },
  message: {
    status: 429,
    message: "Okay for real, you need to chill. Rate limit exceeded. (120 reqs/min/IP)"
  }
});

app.use(limiter);

// Home route
app.get('/', (req, res) => {
  res.json({
    name: 'mock-server',
    tagline: 'Like Mockoon, but worse.',
    usage: 'GET /:statusCode — e.g. GET /404',
    availableCodes: validCodes,
    repository: 'https://github.com/Dansyuqri/mock-server'
  });
});

// Random response for a given status code
app.get('/:statusCode', (req, res) => {
  const code = Number(req.params.statusCode);

  if (isNaN(code) || !responses[code]) {
    return res.status(404).json({
      status: 404,
      message: "I don't have a snarky response for that status code. Yet. Feel free to contribute one!"
    });
  }

  const pool = responses[code];
  const message = pool[Math.floor(Math.random() * pool.length)];

  res.status(code).json({ status: code, message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`mock-server is roasting on port ${PORT}`);
  });
}

module.exports = app;
