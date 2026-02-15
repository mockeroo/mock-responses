# Contributing to mock-server

Thanks for wanting to make HTTP errors funnier! Here's how to contribute.

## Adding Responses

The easiest way to contribute is by adding new sarcastic responses to `responses.json`.

### Steps

1. Fork this repository
2. Edit `responses.json`
3. Run `npm run validate` to check your changes
4. Open a Pull Request

### Format

`responses.json` is a JSON object where keys are HTTP status codes and values are arrays of strings:

```json
{
  "404": [
    "Existing message...",
    "Your new message here!"
  ]
}
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

You can add responses for any valid HTTP status code (100-599) that doesn't exist yet. Just add a new key to the JSON object with at least one message:

```json
{
  "402": [
    "Payment required. My therapy bills aren't going to pay themselves."
  ]
}
```

## Reporting Issues

Use GitHub Issues. Be specific about what's wrong or what you'd like to see.

## Code Changes

For changes beyond `responses.json` (server logic, infrastructure, etc.), please open an issue first to discuss the approach.

## Security

If you find a security vulnerability, please **do not** open a public issue. Email the maintainer directly or use GitHub's private vulnerability reporting.
