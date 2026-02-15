# mock-server

Like Mockoon, but worse.

A server that mocks **you**. Returns real HTTP status codes with sarcastic, judgmental messages — perfect for developers who want their error responses to hurt a little.

## API Usage

**Base URL:** `http://localhost:3000` (or wherever you deploy it)

**Method:** `GET`

**Rate Limit:** 120 requests/minute per IP

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Returns available status codes and usage info |
| `GET /:statusCode` | Returns the real HTTP status code with a random snarky message |

### Example Request

```
GET /404
```

### Example Response

```json
{
  "status": 404,
  "message": "Whatever you're looking for, it's not here. Just like my will to help you."
}
```

The response actually comes back with HTTP status 404 — so it works as a real mock endpoint for testing how your app handles different status codes. Except now the errors are personal.

### Available Status Codes

`200` `201` `204` `301` `302` `304` `400` `401` `403` `404` `405` `408` `409` `413` `418` `429` `500` `502` `503` `504`

Want more? [Contribute one!](CONTRIBUTING.md)

## Self-Hosting

```bash
git clone https://github.com/Dansyuqri/mock-server.git
cd mock-server
npm install
npm start
```

Or with Docker:

```bash
docker build -t mock-server .
docker run -p 3000:3000 mock-server
```

## Project Structure

```
mock-server/
├── index.js            # Express server (~50 lines)
├── responses.json      # All sarcastic messages, organized by status code
├── validate.js         # Validates responses.json for contributors
├── package.json        # Dependencies and scripts
├── Dockerfile          # Production container
├── CONTRIBUTING.md     # How to add responses
├── CLAUDE.md           # AI assistant guidance
├── LICENSE             # MIT
└── README.md           # You are here
```

## Contributing

The easiest way to contribute is by adding funny messages to `responses.json`. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**TL;DR:** Edit `responses.json`, run `npm run validate`, open a PR.

## License

MIT
