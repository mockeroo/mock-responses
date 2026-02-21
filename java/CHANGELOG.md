# Changelog

## [0.1.0] - 2026-02-21

### Added
- Initial release of the Java library `com.mockeroo:mock-responses`.
- `MockResponses.getResponse(int statusCode)` — returns a random sarcastic response wrapped in `Optional`.
- `MockResponses.getAvailableCodes()` — returns all supported HTTP status codes.
- `ResponsesData.java` generated from the canonical `responses/*.json` files.
- `gen/GenerateResponses.java` standalone generator to regenerate `ResponsesData.java`.
