# mock-responses

Responses that mock you. An npm package that provides sarcastic, judgmental HTTP responses you can mount in your own Express app.

## Try It Live

A live server running this package is available at **https://mock-server.mockeroo.workers.dev/**

Hit it directly from your terminal — no installation required:

```bash
# Project info and available status codes
curl https://mock-server.mockeroo.workers.dev/

# Get a sarcastic 404
curl https://mock-server.mockeroo.workers.dev/404

# Get a sarcastic 500
curl https://mock-server.mockeroo.workers.dev/500

# Or use it as a real mock endpoint in your tests
curl -i https://mock-server.mockeroo.workers.dev/418
```

Each endpoint returns the actual HTTP status code, so it works as a real mock server for testing error handling.

## Installation

**npm**
```bash
npm install @mockeroo/mock-responses
```

**Rust**
```toml
# Cargo.toml
[dependencies]
mockeroo-mock-responses = "0.1"
```

**Go**
```bash
go get github.com/mockeroo/mock-response/go
```

## Usage

### JavaScript

#### `getResponse(statusCode)`

Returns a random sarcastic `{ status, message }` for the given HTTP status code, or `null` if unavailable.

```javascript
const { getResponse } = require('@mockeroo/mock-responses');

const result = getResponse(404);
// { status: 404, message: "Whatever you're looking for, it's not here. Just like my will to help you." }

const missing = getResponse(999);
// null
```

#### `getAvailableCodes()`

Returns a sorted array of all available HTTP status codes.

```javascript
const { getAvailableCodes } = require('@mockeroo/mock-responses');

console.log(getAvailableCodes());
// [200, 201, 204, 301, 302, 304, 400, 401, 403, 404, ...]
```

### Rust

#### `get_response(status_code)`

Returns a random sarcastic `Response` for the given HTTP status code, or `None` if unavailable.

```rust
use mockeroo_mock_responses::get_response;

if let Some(resp) = get_response(404) {
    println!("{} — {}", resp.status, resp.message);
}
```

#### `get_available_codes()`

Returns a sorted `Vec<u16>` of all supported HTTP status codes.

```rust
use mockeroo_mock_responses::get_available_codes;

println!("{:?}", get_available_codes());
// [200, 201, 204, 301, 302, 304, 400, 401, 403, 404, ...]
```

### Go

```go
import mockresponse "github.com/mockeroo/mock-response/go"

resp := mockresponse.GetResponse(404)
if resp != nil {
    fmt.Println(resp.Status, resp.Message)
}
```

### JavaScript — Express middleware

#### `middleware()`

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
├── responses/          # Canonical data — one JSON file per status code
│   ├── 200.json
│   ├── 404.json
│   ├── 500.json
│   └── ...
├── js/                 # npm package (@mockeroo/mock-responses)
│   ├── lib.js
│   ├── validate.js
│   ├── __tests__/
│   └── package.json
├── go/                 # Go module (github.com/mockeroo/mock-response/go)
│   ├── lib.go
│   ├── gen.go
│   └── lib_test.go
├── rust/               # Rust crate (mockeroo-mock-responses)
│   ├── build.rs        # Generates response data at compile time
│   ├── src/lib.rs
│   └── Cargo.toml
├── CONTRIBUTING.md
└── README.md
```

## Contributing

The easiest way to contribute is by adding funny messages to files in the `responses/` directory. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**TL;DR:** Edit a file in `responses/` (or create a new one), run `npm run validate`, open a PR.

## License

MIT
