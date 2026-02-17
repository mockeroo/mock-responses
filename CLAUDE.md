# CLAUDE.md

## Project Overview

**mock-responses** — "Like Mockoon, but worse."

An npm package that provides sarcastic HTTP responses. Community members contribute funny responses via PRs to files in the `responses/` directory.

- **License**: MIT (Copyright 2026 Shooks)
- **Repository owner**: Dansyuqri
- **Tech stack**: Node.js, Express.js
- **Data format**: One JSON file per status code in `responses/`

## Repository Structure

```
mock-responses/
├── lib.js              # Core library — getResponse(), getAvailableCodes(), middleware()
├── responses/          # Sarcastic messages, one file per HTTP status code
│   ├── 200.json        # e.g. ["message1", "message2"]
│   ├── 404.json
│   ├── 500.json
│   └── ...
├── validate.js         # Validates responses/ directory structure and rules
├── __tests__/          # Test suite (Jest + supertest)
│   ├── lib.test.js     # Unit tests for library API (getResponse, middleware)
│   └── validate.test.js # Unit tests for validation logic
├── package.json        # Dependencies: express, obscenity
├── .gitignore          # node_modules, .env, logs
├── CONTRIBUTING.md     # Contribution guidelines and content rules
├── CLAUDE.md           # This file
├── LICENSE             # MIT License
└── README.md           # Project docs and usage
```

## Development Setup

```bash
npm install
npm test
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm test` | Run all tests (Jest) |
| `npm run validate` | Validate `responses/` directory format and rules |

## Architecture

This is an npm package library. Users install `mock-responses` and import into their own servers:

- `getResponse(statusCode)` — returns `{ status, message }` or `null`
- `getAvailableCodes()` — returns sorted array of available codes
- `middleware()` — returns an Express router mountable at any path

`package.json` `main` points to `lib.js`.

### Data Loading

All `.json` files in `responses/` are read at startup into memory. No database.

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
- **Simplicity first**: The library is one file (`lib.js`). Don't add abstractions unless there's a strong reason.
- **No TypeScript, no linter configured** (yet)

## Testing

- **Framework**: Jest with supertest for HTTP integration tests.
- **Run**: `npm test`
- **TDD**: Write tests before implementing new features. All changes must have corresponding test coverage.
- **Test files**: Located in `__tests__/` directory.
  - `lib.test.js` — Unit tests for `getResponse()`, `getAvailableCodes()`, and `middleware()`.
  - `validate.test.js` — Unit tests for `validateResponses()` (filename validation, content rules, edge cases).
- **Validation**: `npm run validate` is a separate CLI check for the `responses/` directory, also covered by tests.

## CI/CD

- **GitHub Actions**: `.github/workflows/ci.yml` runs on pushes to `main` and all PRs.
  - Matrix: Node.js 20, 22, 24.
  - Steps: `npm ci` → `npm run validate` → `npm test`.
- **Dependabot**: `.github/dependabot.yml` checks npm and GitHub Actions dependencies weekly.

## Security Considerations

This project accepts community contributions to `responses/`. Key concerns:

- **Content moderation**: All PRs must be reviewed by maintainers. CONTRIBUTING.md bans hate speech, personal info, URLs, HTML, and executable content.
- **Validation**: `npm run validate` enforces structural rules (valid JSON, valid status codes, string-only values, 200-char max, no duplicates) and content sanitization (no HTML tags, no URLs, no control characters).
- **No user input processing at runtime**: The library only serves random strings from a static array. This eliminates injection risks.
- **Plain text only**: Responses are served as JSON string values, not rendered as HTML.

## Guidelines for AI Assistants

- **Read before writing**: Always read existing files before proposing changes.
- **Keep it simple**: This project values extreme simplicity. Don't add abstractions, frameworks, or patterns that aren't needed.
- **responses/ is community-contributed**: Treat it as data, not code. Changes to the directory structure affect all contributors.
- **TDD**: Write tests first, then implement. Run `npm test` before committing.
- **Run validate**: After any change to files in `responses/`, run `npm run validate`.
- **Update this file**: When adding infrastructure or conventions, update CLAUDE.md.
- **Small commits**: Prefer focused, single-purpose commits.
