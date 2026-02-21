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

The response actually comes back with HTTP status 404 — so it works as a real mock endpoint for testing how your app handles different status codes. Except now the errors are personal.

## Available Status Codes

`200` `201` `204` `301` `302` `304` `400` `401` `403` `404` `405` `408` `409` `413` `418` `429` `500` `502` `503` `504`

Want more? [Contribute one!](CONTRIBUTING.md)

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
│   ├── build.rs        # Copies response data at compile time
│   ├── src/lib.rs
│   └── Cargo.toml
├── python/             # Python package (mockeroo-mock-responses)
│   ├── hatch_build.py  # Copies response data at install time
│   ├── src/mockeroo_mock_responses/__init__.py
│   └── pyproject.toml
├── CONTRIBUTING.md
└── README.md
```

## Contributing

The easiest way to contribute is by adding funny messages to files in the `responses/` directory. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**TL;DR:** Edit a file in `responses/` (or create a new one), run `npm run validate`, open a PR.

## License

MIT
