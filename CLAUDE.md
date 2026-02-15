# CLAUDE.md

## Project Overview

**mock-server** — "Like Mockoon, but worse."

A server that mocks **you**. It returns real HTTP status codes with sarcastic, judgmental messages. Community members contribute funny responses via PRs to files in the `responses/` directory.

- **License**: MIT (Copyright 2026 Shooks)
- **Repository owner**: Dansyuqri
- **Tech stack**: Node.js, Express.js
- **Data format**: One JSON file per status code in `responses/`

## Repository Structure

```
mock-server/
├── index.js            # Express server — entry point, all routes
├── responses/          # Sarcastic messages, one file per HTTP status code
│   ├── 200.json        # e.g. ["message1", "message2"]
│   ├── 404.json
│   ├── 500.json
│   └── ...
├── validate.js         # Validates responses/ directory structure and rules
├── __tests__/          # Test suite (Jest + supertest)
│   ├── server.test.js  # Integration tests for API routes
│   └── validate.test.js # Unit tests for validation logic
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
| `npm test` | Run all tests (Jest) |
| `npm run validate` | Validate `responses/` directory format and rules |

## Architecture

- **Single-file server** (`index.js`, ~50 lines): Express app with two routes.
  - `GET /` — returns project info and available status codes.
  - `GET /:statusCode` — returns the matching HTTP status code with a random sarcastic message from `responses/`.
- **Data loading**: All `.json` files in `responses/` are read at startup into memory. No database.
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

### Data Format (`responses/`)

Each file is named `{statusCode}.json` and contains a JSON array of strings:

**`responses/404.json`**
```json
[
  "message1",
  "message2"
]
```

Filenames must be valid HTTP status codes (100-599). Arrays must be non-empty. Strings max 200 chars each.

## Code Conventions

- **Language**: Plain JavaScript (Node.js, CommonJS `require`)
- **No build step**: Code runs directly with `node`
- **Simplicity first**: The entire server is intentionally one file. Don't split into routes/controllers/middleware unless there's a strong reason.
- **No TypeScript, no linter configured** (yet)

## Testing

- **Framework**: Jest with supertest for HTTP integration tests.
- **Run**: `npm test`
- **TDD**: Write tests before implementing new features. All changes must have corresponding test coverage.
- **Test files**: Located in `__tests__/` directory.
  - `server.test.js` — Integration tests for API routes (GET /, GET /:statusCode, CORS, error handling).
  - `validate.test.js` — Unit tests for `validateResponses()` (filename validation, content rules, edge cases).
- **Validation**: `npm run validate` is a separate CLI check for the `responses/` directory, also covered by tests.

## CI/CD

No CI/CD pipelines configured yet. When added, `npm run validate` should be a required check on PRs.

## Security Considerations

This project accepts community contributions to `responses/`. Key concerns:

- **Content moderation**: All PRs must be reviewed by maintainers. CONTRIBUTING.md bans hate speech, personal info, URLs, HTML, and executable content.
- **Validation**: `npm run validate` enforces structural rules (valid JSON, valid status codes, string-only values, 200-char max, no duplicates).
- **No user input processing at runtime**: The server reads no query params, no request body — it only serves random strings from a static array. This eliminates injection risks.
- **Rate limiting**: Prevents abuse of the live endpoint.
- **Plain text only**: Responses are served as JSON string values, not rendered as HTML.

## Guidelines for AI Assistants

- **Read before writing**: Always read existing files before proposing changes.
- **Keep it simple**: This project values extreme simplicity. The whole server is ~50 lines. Don't add abstractions, frameworks, or patterns that aren't needed.
- **responses/ is community-contributed**: Treat it as data, not code. Changes to the directory structure affect all contributors.
- **TDD**: Write tests first, then implement. Run `npm test` before committing.
- **Run validate**: After any change to files in `responses/`, run `npm run validate`.
- **Update this file**: When adding infrastructure or conventions, update CLAUDE.md.
- **Small commits**: Prefer focused, single-purpose commits.
