const fs = require('fs');
const path = require('path');
const os = require('os');
const { validateResponses } = require('../validate');

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'mock-server-test-'));
}

function writeFile(dir, filename, content) {
  fs.writeFileSync(path.join(dir, filename), content);
}

afterEach(() => {
  // Clean up is handled by the OS for tmpdir, but be explicit
});

describe('validateResponses', () => {
  describe('directory structure', () => {
    it('errors when directory does not exist', () => {
      const result = validateResponses('/nonexistent/path');
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/does not exist/);
    });

    it('errors when directory has no JSON files', () => {
      const dir = createTempDir();
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/no .json files/);
      fs.rmSync(dir, { recursive: true });
    });

    it('warns about non-JSON files', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["OK"]');
      writeFile(dir, 'README.md', '# hi');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(0);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0]).toMatch(/README\.md/);
      fs.rmSync(dir, { recursive: true });
    });
  });

  describe('filename validation', () => {
    it('accepts valid HTTP status codes (100-599)', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["OK"]');
      writeFile(dir, '404.json', '["Not found"]');
      writeFile(dir, '599.json', '["Edge case"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(0);
      expect(result.fileCount).toBe(3);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects filenames outside 100-599 range', () => {
      const dir = createTempDir();
      writeFile(dir, '99.json', '["Too low"]');
      writeFile(dir, '600.json', '["Too high"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(2);
      expect(result.errors[0]).toMatch(/not a valid HTTP status code/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects non-numeric filenames', () => {
      const dir = createTempDir();
      writeFile(dir, 'abc.json', '["Nope"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/not a valid HTTP status code/);
      fs.rmSync(dir, { recursive: true });
    });
  });

  describe('content validation', () => {
    it('accepts a valid non-empty array of strings', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["Hello", "World"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(0);
      expect(result.messageCount).toBe(2);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects invalid JSON', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', 'not json{{{');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/not valid JSON/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects an empty array', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '[]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/non-empty/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects non-array JSON (object)', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '{"message": "nope"}');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/non-empty JSON array/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects non-string values in the array', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '[123, true, null]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(3);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects empty or whitespace-only strings', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["", "   "]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(2);
      expect(result.errors[0]).toMatch(/empty or whitespace/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects strings exceeding 200 characters', () => {
      const dir = createTempDir();
      const longMsg = 'x'.repeat(201);
      writeFile(dir, '200.json', JSON.stringify([longMsg]));
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/exceeds 200 characters/);
      fs.rmSync(dir, { recursive: true });
    });

    it('accepts strings at exactly 200 characters', () => {
      const dir = createTempDir();
      const exactMsg = 'x'.repeat(200);
      writeFile(dir, '200.json', JSON.stringify([exactMsg]));
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(0);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects duplicate strings within the same file', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["same", "same"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/duplicate/);
      fs.rmSync(dir, { recursive: true });
    });
  });

  describe('content sanitization', () => {
    it('rejects strings containing HTML tags', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["<script>alert(1)</script>"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/HTML/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects strings containing HTML entities used for injection', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["<img onerror=alert(1) src=x>"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/HTML/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects strings containing URLs', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["Check out https://evil.com for more"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/URL/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects strings containing http:// URLs', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["Visit http://evil.com"]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/URL/);
      fs.rmSync(dir, { recursive: true });
    });

    it('rejects strings containing control characters', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', JSON.stringify(["null\x00byte"]));
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toMatch(/control character/);
      fs.rmSync(dir, { recursive: true });
    });

    it('allows normal printable ASCII and common punctuation', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', '["It works! Don\'t worry... I\'m fine (really)."]');
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(0);
      fs.rmSync(dir, { recursive: true });
    });

    it('allows unicode characters like emoji and accented letters', () => {
      const dir = createTempDir();
      writeFile(dir, '200.json', JSON.stringify(["Très bien! 🎉"]));
      const result = validateResponses(dir);
      expect(result.errors.length).toBe(0);
      fs.rmSync(dir, { recursive: true });
    });
  });

  describe('actual responses/ directory', () => {
    it('passes validation on the real responses directory', () => {
      const responsesDir = path.join(__dirname, '..', 'responses');
      const result = validateResponses(responsesDir);
      expect(result.errors).toEqual([]);
      expect(result.fileCount).toBeGreaterThan(0);
      expect(result.messageCount).toBeGreaterThan(0);
    });
  });
});
