# Contributing to mock-responses

Thanks for wanting to make HTTP errors funnier! Here's how to contribute.

## Adding Responses

The easiest way to contribute is by adding new sarcastic responses to files in the `responses/` directory.

### Steps

1. Fork this repository
2. Edit an existing file in `responses/` (e.g. `responses/404.json`) or create a new one
3. Run `npm run validate` to check your changes
4. Open a Pull Request

### Format

Each file in `responses/` is named after an HTTP status code and contains a JSON array of strings:

**`responses/404.json`**
```json
[
  "Existing message...",
  "Your new message here!"
]
```

### Rules

- **Keep it funny, not offensive.** Sarcastic and snarky is great. Slurs, hate speech, or targeted harassment is not. Maintainers reserve the right to reject anything that crosses the line.
- **Max 200 characters per message.** Keep it punchy.
- **No duplicates.** Check existing messages for your status code before adding.
- **No URLs, HTML, or executable content.** Plain text only.
- **No personal information.** Don't include names, emails, or identifying info.
- **Valid HTTP status codes only.** Codes must be between 100 and 599.
- **Valid JSON.** Run `npm run validate` before submitting. Broken JSON will be auto-rejected.

### Adding a New Status Code

Create a new file named `{code}.json` in the `responses/` directory with at least one message:

**`responses/402.json`**
```json
[
  "Payment required. My therapy bills aren't going to pay themselves."
]
```

## Reporting Issues

Use GitHub Issues. Be specific about what's wrong or what you'd like to see.

## Code Changes

For changes beyond the `responses/` directory (library logic, infrastructure, etc.), please open an issue first to discuss the approach.

## Security

If you find a security vulnerability, please **do not** open a public issue. Email the maintainer directly or use GitHub's private vulnerability reporting.
