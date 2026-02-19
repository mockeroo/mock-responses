/**
 * Validates files in the responses/ directory.
 * Each file must be named {statusCode}.json and contain a JSON array of strings.
 * Run with: npm run validate
 */

const fs = require('fs');
const path = require('path');
const { RegExpMatcher, englishDataset, englishRecommendedTransformers } = require('obscenity');

const profanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

/**
 * Validates a responses directory.
 * Returns { errors: string[], warnings: string[], fileCount: number, messageCount: number }
 */
function validateResponses(responsesDir) {
  const result = { errors: [], warnings: [], fileCount: 0, messageCount: 0 };

  if (!fs.existsSync(responsesDir)) {
    result.errors.push('responses/ directory does not exist.');
    return result;
  }

  const files = fs.readdirSync(responsesDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  if (jsonFiles.length === 0) {
    result.errors.push('responses/ directory contains no .json files.');
    return result;
  }

  for (const file of jsonFiles) {
    const filePath = path.join(responsesDir, file);
    const code = path.basename(file, '.json');

    // Filename must be a valid HTTP status code (100-599)
    const num = Number(code);
    if (isNaN(num) || num < 100 || num > 599 || !Number.isInteger(num)) {
      result.errors.push(`${file} — filename is not a valid HTTP status code (must be 100-599).`);
      continue;
    }

    // Must be valid JSON
    let messages;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      messages = JSON.parse(raw);
    } catch (err) {
      result.errors.push(`${file} — not valid JSON: ${err.message}`);
      continue;
    }

    // Must be a non-empty array
    if (!Array.isArray(messages) || messages.length === 0) {
      result.errors.push(`${file} — must be a non-empty JSON array.`);
      continue;
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      if (typeof msg !== 'string') {
        result.errors.push(`${file}, index ${i}: must be a string, got ${typeof msg}.`);
        continue;
      }

      if (msg.trim().length === 0) {
        result.errors.push(`${file}, index ${i}: message is empty or whitespace.`);
      }

      if (msg.length > 200) {
        result.errors.push(`${file}, index ${i}: message exceeds 200 characters (${msg.length}).`);
      }

      // No HTML tags (defense-in-depth against XSS if consumers render in HTML)
      if (/<[a-zA-Z][^>]*>/.test(msg)) {
        result.errors.push(`${file}, index ${i}: message contains HTML tags (not allowed).`);
      }

      // No URLs
      if (/https?:\/\//.test(msg)) {
        result.errors.push(`${file}, index ${i}: message contains a URL (not allowed).`);
      }

      // No control characters (except normal whitespace: space, tab)
      // eslint-disable-next-line no-control-regex
      if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(msg)) {
        result.errors.push(`${file}, index ${i}: message contains a control character (not allowed).`);
      }

      // No profanity
      if (profanityMatcher.hasMatch(msg)) {
        result.errors.push(`${file}, index ${i}: message contains profanity (not allowed).`);
      }

      // Check for duplicates within the same file
      const dupeIndex = messages.indexOf(msg);
      if (dupeIndex !== i) {
        result.errors.push(`${file}, index ${i}: duplicate of index ${dupeIndex}.`);
      }
    }

    result.messageCount += messages.length;
  }

  result.fileCount = jsonFiles.length;

  // Warn about non-JSON files
  const nonJsonFiles = files.filter(f => !f.endsWith('.json'));
  for (const file of nonJsonFiles) {
    result.warnings.push(`${file} — unexpected non-JSON file in responses/ directory.`);
  }

  return result;
}

// CLI mode
if (require.main === module) {
  const responsesDir = fs.existsSync(path.join(__dirname, 'responses'))
    ? path.join(__dirname, 'responses')
    : path.join(__dirname, '..', 'responses');
  const result = validateResponses(responsesDir);

  for (const warn of result.warnings) {
    console.warn(`WARN: ${warn}`);
  }

  if (result.errors.length > 0) {
    for (const err of result.errors) {
      console.error(`FAIL: ${err}`);
    }
    console.error(`\nValidation failed with ${result.errors.length} error(s).`);
    process.exit(1);
  } else {
    console.log(`OK: ${result.fileCount} status codes, ${result.messageCount} total messages.`);
  }
}

module.exports = { validateResponses };
