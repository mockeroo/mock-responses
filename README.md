# mock-responses

Responses that mock you back. Sarcastic, judgmental HTTP status responses for testing and development.

## Try It Live

A live server is available at **https://mock-server.mockeroo.workers.dev/**

```bash
curl https://mock-server.mockeroo.workers.dev/404
curl -i https://mock-server.mockeroo.workers.dev/500
```

Each endpoint returns the actual HTTP status code, so it works as a real mock server for testing error handling.

## Installation & Usage

Each language has its own README with installation instructions, API reference, and full examples:

| Language | Package | README |
|----------|---------|--------|
| JavaScript / Node.js | `@mockeroo/mock-responses` (npm) | [js/README.md](js/README.md) |
| Python | `mockeroo-mock-responses` (PyPI) | [python/README.md](python/README.md) |
| Go | `github.com/mockeroo/mock-response/go` | [go/README.md](go/README.md) |
| Rust | `mockeroo-mock-responses` (crates.io) | [rust/README.md](rust/README.md) |
| Java | `com.mockeroo:mock-responses` (Maven) | [java/README.md](java/README.md) |
| PHP | `mockeroo/mock-responses` (Composer) | [php/README.md](php/README.md) |
| Ruby | `mockeroo-mock-responses` (gem) | [ruby/README.md](ruby/README.md) |

### Example Response

```json
{
  "status": 404,
  "message": "Whatever you're looking for, it's not here. Just like my will to help you."
}
```

## Available Status Codes

`200` `201` `204` `301` `302` `304` `400` `401` `403` `404` `405` `408` `409` `413` `418` `429` `500` `502` `503` `504`

Want more? [Contribute one!](CONTRIBUTING.md)

## Project Structure

```
mock-responses/
├── responses/    # Canonical data — one JSON file per status code
├── js/           # npm package
├── go/           # Go module
├── rust/         # Rust crate
├── python/       # Python package
├── php/          # Composer package
├── java/         # Maven package (GitHub Packages)
└── ruby/         # Ruby gem
```

## Contributing

The easiest way to contribute is by adding funny messages to files in the `responses/` directory. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**TL;DR:** Edit a file in `responses/` (or create a new one), run `npm run validate`, open a PR.

## License

MIT
