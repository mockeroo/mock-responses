# mock-responses

Responses that mock you. An npm package that provides sarcastic, judgmental HTTP responses you can mount in your own Express app.

## Try It Live

A live server running this package is available at **https://mock-server.dansyuqri.workers.dev/**

Hit it directly from your terminal — no installation required:

```bash
# Project info and available status codes
curl https://mock-server.dansyuqri.workers.dev/

# Get a sarcastic 404
curl https://mock-server.dansyuqri.workers.dev/404

# Get a sarcastic 500
curl https://mock-server.dansyuqri.workers.dev/500

# Or use it as a real mock endpoint in your tests
curl -i https://mock-server.dansyuqri.workers.dev/418
```

Each endpoint returns the actual HTTP status code, so it works as a real mock server for testing error handling.

## Installation

```bash
npm install @mockeroo/mock-responses
```

## Usage

### `getResponse(statusCode)`

Returns a random sarcastic `{ status, message }` for the given HTTP status code, or `null` if unavailable.

```javascript
const { getResponse } = require('@mockeroo/mock-responses');

const result = getResponse(404);
// { status: 404, message: "Whatever you're looking for, it's not here. Just like my will to help you." }

const missing = getResponse(999);
// null
```

### `getAvailableCodes()`

Returns a sorted array of all available HTTP status codes.

```javascript
const { getAvailableCodes } = require('@mockeroo/mock-responses');

console.log(getAvailableCodes());
// [200, 201, 204, 301, 302, 304, 400, 401, 403, 404, ...]
```

### `middleware()`

Returns an Express router you can mount at any path:

```javascript
const express = require('express');
const { middleware } = require('@mockeroo/mock-responses');

const app = express();
app.use('/mock', middleware());
app.listen(3000);
```

This gives you:
- `GET /mock/` — project info and available codes
- `GET /mock/:statusCode` — sarcastic response with the real HTTP status code

### Example Response

```json
{
  "status": 404,
  "message": "Whatever you're looking for, it's not here. Just like my will to help you."
}
```

The response actually comes back with HTTP status 404 — so it works as a real mock endpoint for testing how your app handles different status codes. Except now the errors are personal.

## Available Status Codes

`200` `201` `204` `301` `302` `304` `400` `401` `403` `404` `405` `408` `409` `413` `418` `429` `500` `502` `503` `504`

Want more? [Contribute one!](CONTRIBUTING.md)

## Full Example

```javascript
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { middleware } = require('@mockeroo/mock-responses');

const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { status: 429, message: "Rate limit exceeded." }
});
app.use(limiter);

app.use('/', middleware());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Project Structure

```
mock-responses/
├── lib.js              # Core library (getResponse, getAvailableCodes, middleware)
├── responses/          # Sarcastic messages, one file per status code
│   ├── 200.json
│   ├── 404.json
│   ├── 500.json
│   └── ...
├── validate.js         # Validates responses/ for contributors
├── __tests__/          # Test suite
│   ├── lib.test.js
│   └── validate.test.js
├── package.json
├── CONTRIBUTING.md
└── README.md
```

## Contributing

The easiest way to contribute is by adding funny messages to files in the `responses/` directory. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**TL;DR:** Edit a file in `responses/` (or create a new one), run `npm run validate`, open a PR.

## License

MIT
