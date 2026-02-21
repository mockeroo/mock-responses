package com.mockeroo.mockresponses;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class MockResponsesTest {

    @Test
    void knownCodeReturnsResponse() {
        Optional<MockResponse> resp = MockResponses.getResponse(200);
        assertTrue(resp.isPresent(), "expected non-empty Optional for 200");
        assertEquals(200, resp.get().getStatus());
        assertFalse(resp.get().getMessage().isEmpty(), "expected non-empty message");
    }

    @Test
    void unknownCodeReturnsEmpty() {
        Optional<MockResponse> resp = MockResponses.getResponse(999);
        assertTrue(resp.isEmpty(), "expected empty Optional for unknown code 999");
    }

    @Test
    void allAvailableCodesReturnResponses() {
        for (int code : MockResponses.getAvailableCodes()) {
            Optional<MockResponse> resp = MockResponses.getResponse(code);
            assertTrue(resp.isPresent(),
                    "getResponse(" + code + ") returned empty but code is listed as available");
            assertEquals(code, resp.get().getStatus());
            assertFalse(resp.get().getMessage().isEmpty(), "empty message for code " + code);
        }
    }

    @Test
    void availableCodesNotEmpty() {
        assertFalse(MockResponses.getAvailableCodes().isEmpty());
    }

    @Test
    void availableCodesAreSorted() {
        List<Integer> codes = MockResponses.getAvailableCodes();
        for (int i = 1; i < codes.size(); i++) {
            assertTrue(codes.get(i) > codes.get(i - 1),
                    "codes not sorted at index " + i + ": " + codes.get(i - 1) + " followed by " + codes.get(i));
        }
    }

    @Test
    void availableCodesContainsExpected() {
        Set<Integer> codes = new HashSet<>(MockResponses.getAvailableCodes());
        for (int expected : new int[]{200, 201, 204, 400, 401, 403, 404, 500}) {
            assertTrue(codes.contains(expected), "expected code " + expected + " to be available");
        }
    }

    @Test
    void availableCodesReturnsCopy() {
        List<Integer> codes1 = MockResponses.getAvailableCodes();
        List<Integer> codes2 = MockResponses.getAvailableCodes();
        int original = codes2.get(0);
        codes1.set(0, -1);
        assertEquals(original, codes2.get(0),
                "getAvailableCodes() should return an independent list each call");
    }

    @Test
    void responsesAreVaried() {
        // 404 has 10 messages; after 100 draws we expect more than one unique message.
        Set<String> seen = new HashSet<>();
        for (int i = 0; i < 100; i++) {
            MockResponses.getResponse(404).ifPresent(r -> seen.add(r.getMessage()));
        }
        assertTrue(seen.size() > 1,
                "getResponse(404) returned the same message 100 times — randomness may be broken");
    }
}
