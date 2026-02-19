const express = require('express');
const fs = require('fs');
const path = require('path');

// Load responses — bundled at ./responses when installed, ../responses in the monorepo
const responsesDir = fs.existsSync(path.join(__dirname, 'responses'))
  ? path.join(__dirname, 'responses')
  : path.join(__dirname, '..', 'responses');
const responses = {};
for (const file of fs.readdirSync(responsesDir)) {
  if (!file.endsWith('.json')) continue;
  const code = path.basename(file, '.json');
  responses[code] = JSON.parse(fs.readFileSync(path.join(responsesDir, file), 'utf-8'));
}
const validCodes = Object.keys(responses).map(Number).sort((a, b) => a - b);

/**
 * Get a random sarcastic response for a given HTTP status code.
 * Returns { status, message } or null if the code is not available.
 */
function getResponse(statusCode) {
  const code = Number(statusCode);
  if (isNaN(code) || !responses[code]) return null;

  const pool = responses[code];
  const message = pool[Math.floor(Math.random() * pool.length)];
  return { status: code, message };
}

/**
 * Get all available HTTP status codes (sorted ascending).
 */
function getAvailableCodes() {
  return validCodes;
}

/**
 * Returns an Express router that serves sarcastic responses.
 * Mount it at any path: app.use('/mock', middleware())
 */
function middleware() {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({
      name: 'mock-responses',
      tagline: 'Like Mockoon, but worse.',
      usage: 'GET /:statusCode — e.g. GET /404',
      availableCodes: validCodes,
      repository: 'https://github.com/Dansyuqri/mock-responses'
    });
  });

  router.get('/:statusCode', (req, res) => {
    const result = getResponse(req.params.statusCode);

    if (!result) {
      return res.status(404).json({
        status: 404,
        message: "I don't have a snarky response for that status code. Yet. Feel free to contribute one!"
      });
    }

    res.status(result.status).json(result);
  });

  return router;
}

module.exports = { getResponse, getAvailableCodes, middleware };
