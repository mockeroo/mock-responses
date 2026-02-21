# mockeroo-mock-responses (Java)

Sarcastic HTTP status code responses for testing and development.

```java
import com.mockeroo.mockresponses.MockResponse;
import com.mockeroo.mockresponses.MockResponses;

MockResponses.getResponse(404).ifPresent(r ->
    System.out.println(r.getStatus() + ": " + r.getMessage())
);
// => 404: Whatever you're looking for, it's not here. Just like my will to help you.

List<Integer> codes = MockResponses.getAvailableCodes();
System.out.println(codes);
// => [200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 405, 408, 409, 413, 418, 429, 500, 502, 503, 504]
```

## Installation

Add to your `pom.xml`:

```xml
<dependency>
  <groupId>com.mockeroo</groupId>
  <artifactId>mock-responses</artifactId>
  <version>0.1.0</version>
</dependency>
```

Or with Gradle:

```groovy
implementation 'com.mockeroo:mock-responses:0.1.0'
```

## API

### `MockResponses.getResponse(int statusCode) → Optional<MockResponse>`

Returns an `Optional<MockResponse>` containing a randomly chosen sarcastic message,
or `Optional.empty()` if the status code is not recognised.

`MockResponse` exposes:
- `getStatus()` → `int`
- `getMessage()` → `String`

### `MockResponses.getAvailableCodes() → List<Integer>`

Returns all supported HTTP status codes in ascending order.  Each call returns a new
list; mutating it has no effect on library state.

## Running tests

```bash
cd java
mvn test
```

## Regenerating embedded response data

The response messages are embedded in `ResponsesData.java` (generated from the
canonical `../responses/*.json` files). To regenerate after updating the JSON files:

```bash
cd java
javac gen/GenerateResponses.java -d gen/out && java -cp gen/out GenerateResponses
```

## License

MIT
