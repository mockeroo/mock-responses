package com.mockeroo.mockresponses;

/**
 * An HTTP status code paired with a randomly chosen sarcastic message.
 */
public final class MockResponse {
    private final int status;
    private final String message;

    MockResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    /** The HTTP status code. */
    public int getStatus() {
        return status;
    }

    /** The sarcastic message for this status code. */
    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return "MockResponse{status=" + status + ", message=\"" + message + "\"}";
    }
}
