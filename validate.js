/**
 * Validates responses.json to ensure it meets contribution guidelines.
 * Run with: npm run validate
 */

const fs = require('fs');

let data;
try {
  const raw = fs.readFileSync('./responses.json', 'utf-8');
  data = JSON.parse(raw);
} catch (err) {
  console.error('FAIL: responses.json is not valid JSON.');
  console.error(err.message);
  process.exit(1);
}

let errors = 0;

// Must be a plain object
if (typeof data !== 'object' || Array.isArray(data) || data === null) {
  console.error('FAIL: responses.json must be a JSON object with status codes as keys.');
  process.exit(1);
}

for (const [code, messages] of Object.entries(data)) {
  // Keys must be valid HTTP status codes (100-599)
  const num = Number(code);
  if (isNaN(num) || num < 100 || num > 599 || !Number.isInteger(num)) {
    console.error(`FAIL: "${code}" is not a valid HTTP status code (must be 100-599).`);
    errors++;
    continue;
  }

  // Values must be non-empty arrays of strings
  if (!Array.isArray(messages) || messages.length === 0) {
    console.error(`FAIL: Status ${code} must have a non-empty array of messages.`);
    errors++;
    continue;
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (typeof msg !== 'string') {
      console.error(`FAIL: Status ${code}, index ${i}: must be a string, got ${typeof msg}.`);
      errors++;
      continue;
    }

    if (msg.trim().length === 0) {
      console.error(`FAIL: Status ${code}, index ${i}: message is empty or whitespace.`);
      errors++;
    }

    if (msg.length > 200) {
      console.error(`FAIL: Status ${code}, index ${i}: message exceeds 200 characters (${msg.length}).`);
      errors++;
    }

    // Check for duplicates within the same status code
    const dupeIndex = messages.indexOf(msg);
    if (dupeIndex !== i) {
      console.error(`FAIL: Status ${code}, index ${i}: duplicate of index ${dupeIndex}.`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\nValidation failed with ${errors} error(s).`);
  process.exit(1);
} else {
  const totalMessages = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`OK: ${Object.keys(data).length} status codes, ${totalMessages} total messages.`);
}
