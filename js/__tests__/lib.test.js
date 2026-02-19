const path = require('path');
const fs = require('fs');
const request = require('supertest');
const express = require('express');

const { getResponse, getAvailableCodes, middleware } = require('../lib');

// Load actual responses for assertions (responses/ lives at the repo root)
const responsesDir = path.join(__dirname, '..', '..', 'responses');
const responseFiles = fs.readdirSync(responsesDir).filter(f => f.endsWith('.json'));
const allResponses = {};
for (const file of responseFiles) {
  const code = path.basename(file, '.json');
  allResponses[code] = JSON.parse(fs.readFileSync(path.join(responsesDir, file), 'utf-8'));
}
const availableCodes = Object.keys(allResponses).map(Number).sort((a, b) => a - b);

describe('getResponse', () => {
  it('returns { status, message } for a valid status code', () => {
    const result = getResponse(404);
    expect(result).toHaveProperty('status', 404);
    expect(result).toHaveProperty('message');
    expect(typeof result.message).toBe('string');
  });

  it('returns a message from the correct response pool', () => {
    const result = getResponse(404);
    expect(allResponses['404']).toContain(result.message);
  });

  it('returns null for an unknown status code', () => {
    expect(getResponse(999)).toBeNull();
  });

  it('returns null for non-numeric input', () => {
    expect(getResponse('abc')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(getResponse(undefined)).toBeNull();
  });

  it('works with string numbers', () => {
    const result = getResponse('404');
    expect(result).toHaveProperty('status', 404);
    expect(allResponses['404']).toContain(result.message);
  });

  it.each([200, 201, 400, 401, 403, 404, 500])('works for status code %i', (code) => {
    const result = getResponse(code);
    expect(result.status).toBe(code);
    expect(allResponses[String(code)]).toContain(result.message);
  });
});

describe('getAvailableCodes', () => {
  it('returns an array of numbers', () => {
    const codes = getAvailableCodes();
    expect(Array.isArray(codes)).toBe(true);
    codes.forEach(code => expect(typeof code).toBe('number'));
  });

  it('returns codes sorted in ascending order', () => {
    const codes = getAvailableCodes();
    for (let i = 1; i < codes.length; i++) {
      expect(codes[i]).toBeGreaterThan(codes[i - 1]);
    }
  });

  it('matches the actual responses directory', () => {
    expect(getAvailableCodes()).toEqual(availableCodes);
  });
});

describe('middleware', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/mock', middleware());
  });

  it('returns an Express router', () => {
    const router = middleware();
    expect(typeof router).toBe('function');
  });

  it('GET /mock/ returns project info with available codes', async () => {
    const res = await request(app).get('/mock/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('mock-responses');
    expect(res.body.availableCodes).toEqual(availableCodes);
  });

  it('GET /mock/:statusCode returns the correct status and message', async () => {
    const res = await request(app).get('/mock/404');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe(404);
    expect(allResponses['404']).toContain(res.body.message);
  });

  it('GET /mock/:statusCode returns 404 for unknown codes', async () => {
    const res = await request(app).get('/mock/999');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/contribute/i);
  });

  it('GET /mock/:statusCode returns JSON content type', async () => {
    const res = await request(app).get('/mock/200');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('can be mounted at any path', async () => {
    const app2 = express();
    app2.use('/api/errors', middleware());
    const res = await request(app2).get('/api/errors/500');
    expect(res.status).toBe(500);
    expect(res.body.status).toBe(500);
  });
});
