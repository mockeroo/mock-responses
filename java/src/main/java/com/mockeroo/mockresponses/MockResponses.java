package com.mockeroo.mockresponses;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

/**
 * Sarcastic HTTP status code responses for testing and development.
 *
 * <p>Mirrors the behaviour of the {@code @mockeroo/mock-responses} npm package.
 *
 * <pre>{@code
 * Optional<MockResponse> resp = MockResponses.getResponse(404);
 * resp.ifPresent(r -> System.out.println(r.getStatus() + ": " + r.getMessage()));
 *
 * List<Integer> codes = MockResponses.getAvailableCodes();
 * System.out.println(codes);
 * }</pre>
 *
 * <p>Response data is generated from {@code responses/*.json} by
 * {@code gen/GenerateResponses.java} and embedded in {@code ResponsesData.java}.
 * Run {@code javac gen/GenerateResponses.java && java -cp gen GenerateResponses}
 * from the {@code java/} directory to regenerate.
 */
public final class MockResponses {
    private static final Random RANDOM = new Random();
    private static final List<Integer> CODES;

    static {
        List<Integer> codes = new ArrayList<>(ResponsesData.RESPONSES.keySet());
        Collections.sort(codes);
        CODES = Collections.unmodifiableList(codes);
    }

    private MockResponses() {}

    /**
     * Returns a {@link MockResponse} with a random sarcastic message for the given HTTP
     * status code, or an empty Optional if the code is not recognised.
     *
     * @param statusCode the HTTP status code
     * @return an Optional containing the response, or empty if the code is unknown
     */
    public static Optional<MockResponse> getResponse(int statusCode) {
        String[] messages = ResponsesData.RESPONSES.get(statusCode);
        if (messages == null || messages.length == 0) {
            return Optional.empty();
        }
        String message = messages[RANDOM.nextInt(messages.length)];
        return Optional.of(new MockResponse(statusCode, message));
    }

    /**
     * Returns all supported HTTP status codes in ascending order.
     * Each call returns a new list so callers may modify it freely.
     *
     * @return sorted list of available status codes
     */
    public static List<Integer> getAvailableCodes() {
        return new ArrayList<>(CODES);
    }
}
