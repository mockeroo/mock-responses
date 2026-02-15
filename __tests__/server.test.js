const request = require('supertest');
const app = require('../index');
const fs = require('fs');
const path = require('path');

// Load the actual responses for assertions
const responsesDir = path.join(__dirname, '..', 'responses');
const responseFiles = fs.readdirSync(responsesDir).filter(f => f.endsWith('.json'));
const allResponses = {};
for (const file of responseFiles) {
  const code = path.basename(file, '.json');
  allResponses[code] = JSON.parse(fs.readFileSync(path.join(responsesDir, file), 'utf-8'));
}
const availableCodes = Object.keys(allResponses).map(Number).sort((a, b) => a - b);

describe('GET /', () => {
  it('returns 200 with project info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('mock-server');
    expect(res.body.tagline).toBe('Like Mockoon, but worse.');
    expect(res.body.usage).toBeDefined();
    expect(res.body.repository).toBeDefined();
  });

  it('returns all available status codes', async () => {
    const res = await request(app).get('/');
    expect(res.body.availableCodes).toEqual(availableCodes);
  });

  it('returns CORS headers', async () => {
    const res = await request(app).get('/');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
});

describe('GET /:statusCode', () => {
  it('returns the correct HTTP status code', async () => {
    const res = await request(app).get('/404');
    expect(res.status).toBe(404);
  });

  it('returns { status, message } shape', async () => {
    const res = await request(app).get('/404');
    expect(res.body).toHaveProperty('status', 404);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });

  it('returns a message from the correct response pool', async () => {
    const res = await request(app).get('/404');
    expect(allResponses['404']).toContain(res.body.message);
  });

  it.each([200, 201, 400, 401, 403, 404, 500])('works for status code %i', async (code) => {
    const res = await request(app).get(`/${code}`);
    expect(res.status).toBe(code);
    expect(res.body.status).toBe(code);
    expect(allResponses[String(code)]).toContain(res.body.message);
  });

  it('returns 404 for unknown status codes', async () => {
    const res = await request(app).get('/999');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.message).toMatch(/contribute/i);
  });

  it('returns 404 for non-numeric paths', async () => {
    const res = await request(app).get('/abc');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe(404);
  });

  it('returns 404 for codes with no responses file', async () => {
    const res = await request(app).get('/199');
    expect(res.status).toBe(404);
  });

  it('returns JSON content type', async () => {
    const res = await request(app).get('/200');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
