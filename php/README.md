# mockeroo/mock-responses (PHP)

Sarcastic HTTP status code responses for testing and development.

```php
use Mockeroo\MockResponses\MockResponses;

$resp = MockResponses::getResponse(404);
if ($resp !== null) {
    echo "{$resp->status}: {$resp->message}\n";
}
// => 404: Whatever you're looking for, it's not here. Just like my will to help you.

$codes = MockResponses::getAvailableCodes();
print_r($codes);
// => [200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 405, 408, 409, 413, 418, 429, 500, 502, 503, 504]
```

## Installation

```bash
composer require mockeroo/mock-responses
```

## API

### `MockResponses::getResponse(int $statusCode): ?Response`

Returns a `Response` object with `status` (int) and `message` (string) properties, or
`null` if the status code is not recognised.  Each call picks a random message from
the pool.

### `MockResponses::getAvailableCodes(): array`

Returns all supported HTTP status codes as a sorted `list<int>`.  Each call returns a
new array; mutating it has no effect on library state.

## Running tests

```bash
cd php
composer install
composer test
```

## License

MIT
