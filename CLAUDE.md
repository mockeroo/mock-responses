# CLAUDE.md

## Project Overview

**mock-server** — "Like Mockoon, but worse."

A server that mocks **you**. It returns real HTTP status codes with sarcastic, judgmental messages. Community members contribute funny responses via PRs to `responses.json`.

- **License**: MIT (Copyright 2026 Shooks)
- **Repository owner**: Dansyuqri
- **Tech stack**: Node.js, Express.js
- **Data format**: Flat JSON file (`responses.json`)

## Repository Structure

```
mock-server/
├── index.js            # Express server — entry point, all routes
├── responses.json      # Sarcastic messages keyed by HTTP status code
├── validate.js         # Validates responses.json structure and rules
├── package.json        # Dependencies: express, cors, express-rate-limit
├── Dockerfile          # Production container (Node 22 Alpine)
├── .gitignore          # node_modules, .env, logs
├── CONTRIBUTING.md     # Contribution guidelines and content rules
├── CLAUDE.md           # This file
├── LICENSE             # MIT License
└── README.md           # Project docs and usage
```

## Development Setup

```bash
npm install
npm start           # Starts server on port 3000 (or PORT env var)
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm start` | Start the server (`node index.js`) |
| `npm run validate` | Validate `responses.json` format and rules |

## Architecture

- **Single-file server** (`index.js`, ~50 lines): Express app with two routes.
  - `GET /` — returns project info and available status codes.
  - `GET /:statusCode` — returns the matching HTTP status code with a random sarcastic message from `responses.json`.
- **Data loading**: `responses.json` is read once at startup into memory. No database.
- **Rate limiting**: 120 req/min per IP via `express-rate-limit`. Uses `cf-connecting-ip` header when behind Cloudflare.
- **CORS**: Enabled for all origins (public API).

### Response Format

```json
{
  "status": 404,
  "message": "Whatever you're looking for, it's not here. Just like my will to help you."
}
```

The response HTTP status code matches the requested code.

### Data Format (`responses.json`)

```json
{
  "200": ["message1", "message2"],
  "404": ["message1", "message2"]
}
```

Keys are HTTP status code strings (100-599). Values are non-empty arrays of strings (max 200 chars each).

## Code Conventions

- **Language**: Plain JavaScript (Node.js, CommonJS `require`)
- **No build step**: Code runs directly with `node`
- **Simplicity first**: The entire server is intentionally one file. Don't split into routes/controllers/middleware unless there's a strong reason.
- **No TypeScript, no linter configured** (yet)

## Testing

- **Validation only**: `npm run validate` checks `responses.json` for structural correctness (valid codes, non-empty strings, no duplicates, max length).
- No unit test framework is configured yet.

## CI/CD

No CI/CD pipelines configured yet. When added, `npm run validate` should be a required check on PRs.

## Security Considerations

This project accepts community contributions to `responses.json`. Key concerns:

- **Content moderation**: All PRs must be reviewed by maintainers. CONTRIBUTING.md bans hate speech, personal info, URLs, HTML, and executable content.
- **Validation**: `npm run validate` enforces structural rules (valid JSON, valid status codes, string-only values, 200-char max, no duplicates).
- **No user input processing at runtime**: The server reads no query params, no request body — it only serves random strings from a static array. This eliminates injection risks.
- **Rate limiting**: Prevents abuse of the live endpoint.
- **Plain text only**: Responses are served as JSON string values, not rendered as HTML.

## Guidelines for AI Assistants

- **Read before writing**: Always read existing files before proposing changes.
- **Keep it simple**: This project values extreme simplicity. The whole server is ~50 lines. Don't add abstractions, frameworks, or patterns that aren't needed.
- **responses.json is community-contributed**: Treat it as data, not code. Changes to its structure affect all contributors.
- **Run validate**: After any change to `responses.json`, run `npm run validate`.
- **Update this file**: When adding infrastructure or conventions, update CLAUDE.md.
- **Small commits**: Prefer focused, single-purpose commits.
