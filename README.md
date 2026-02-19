# mock-responses

Like Mockoon, but worse.

Responses that mock you. A package that provides sarcastic, judgmental HTTP responses for any language or framework.

## Try It Live

A live server is available at **https://mock-server.dansyuqri.workers.dev/**

```bash
curl https://mock-server.dansyuqri.workers.dev/404
curl https://mock-server.dansyuqri.workers.dev/500
curl -i https://mock-server.dansyuqri.workers.dev/418
```

Each endpoint returns the actual HTTP status code, so it works as a real mock server for testing error handling.

## Language Packages

| Language   | Package                      | Install                                      |
| ---------- | ---------------------------- | -------------------------------------------- |
| JavaScript | `@mockeroo/mock-responses`   | `npm install @mockeroo/mock-responses`        |
| Python     | `mockeroo-mock-responses`    | `pip install mockeroo-mock-responses`         |

---

## JavaScript

```bash
npm install @mockeroo/mock-responses
```

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
// GET /mock/404 → { status: 404, message: "..." }
```

---

## Python

```bash
pip install mockeroo-mock-responses
```

### `get_response(status_code)`

Returns a random sarcastic `{"status": int, "message": str}` dict, or `None` if unavailable.

```python
from mock_responses import get_response

result = get_response(404)
# {"status": 404, "message": "Whatever you're looking for, it's not here. Just like my will to help you."}

missing = get_response(999)
# None
```

### `get_available_codes()`

Returns a sorted list of all available HTTP status codes.

```python
from mock_responses import get_available_codes

print(get_available_codes())
# [200, 201, 204, 301, 302, 304, 400, 401, 403, 404, ...]
```

---

## Available Status Codes

`200` `201` `204` `301` `302` `304` `400` `401` `403` `404` `405` `408` `409` `413` `418` `429` `500` `502` `503` `504`

Want more? [Contribute one!](CONTRIBUTING.md)

---

## Example Response

```json
{
  "status": 404,
  "message": "Whatever you're looking for, it's not here. Just like my will to help you."
}
```

---

## Project Structure

```
mock-responses/
├── responses/          # Sarcastic messages — shared across all language packages
│   ├── 200.json
│   ├── 404.json
│   ├── 500.json
│   └── ...
├── js/                 # JavaScript/npm package (@mockeroo/mock-responses)
│   ├── lib.js
│   ├── validate.js
│   ├── __tests__/
│   └── package.json
├── python/             # Python/PyPI package (mockeroo-mock-responses)
│   ├── mock_responses/
│   └── pyproject.toml
├── CONTRIBUTING.md
└── README.md
```

## Contributing

The easiest way to contribute is by adding funny messages to files in the `responses/` directory — changes there are automatically picked up by every language package. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**TL;DR:** Edit a file in `responses/` (or create a new one), run `cd js && npm run validate`, open a PR.

## License

MIT
