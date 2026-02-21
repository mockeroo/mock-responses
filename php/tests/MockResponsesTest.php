<?php

declare(strict_types=1);

namespace Mockeroo\MockResponses\Tests;

use Mockeroo\MockResponses\MockResponses;
use PHPUnit\Framework\TestCase;

final class MockResponsesTest extends TestCase
{
    public function testKnownCodeReturnsResponse(): void
    {
        $resp = MockResponses::getResponse(200);
        $this->assertNotNull($resp);
        $this->assertSame(200, $resp->status);
        $this->assertNotEmpty($resp->message);
    }

    public function testUnknownCodeReturnsNull(): void
    {
        $this->assertNull(MockResponses::getResponse(999));
    }

    public function testAllAvailableCodesReturnResponses(): void
    {
        foreach (MockResponses::getAvailableCodes() as $code) {
            $resp = MockResponses::getResponse($code);
            $this->assertNotNull($resp, "getResponse($code) returned null but code is listed as available");
            $this->assertSame($code, $resp->status);
            $this->assertNotEmpty($resp->message, "empty message for code $code");
        }
    }

    public function testAvailableCodesNotEmpty(): void
    {
        $this->assertNotEmpty(MockResponses::getAvailableCodes());
    }

    public function testAvailableCodesAreSorted(): void
    {
        $codes = MockResponses::getAvailableCodes();
        $sorted = $codes;
        sort($sorted);
        $this->assertSame($sorted, $codes);
    }

    public function testAvailableCodesContainsExpected(): void
    {
        $codes = MockResponses::getAvailableCodes();
        foreach ([200, 201, 204, 400, 401, 403, 404, 500] as $expected) {
            $this->assertContains($expected, $codes, "expected code $expected to be available");
        }
    }

    public function testAvailableCodesReturnsCopy(): void
    {
        $codes1 = MockResponses::getAvailableCodes();
        $codes2 = MockResponses::getAvailableCodes();
        $original = $codes2[0];
        $codes1[0] = -1;
        $this->assertSame($original, $codes2[0],
            'getAvailableCodes() should return an independent array each call');
    }

    public function testResponsesAreVaried(): void
    {
        // 404 has 10 messages; after 100 draws we expect more than one unique message.
        $seen = [];
        for ($i = 0; $i < 100; $i++) {
            $resp = MockResponses::getResponse(404);
            if ($resp !== null) {
                $seen[$resp->message] = true;
            }
        }
        $this->assertGreaterThan(
            1,
            count($seen),
            'getResponse(404) returned the same message 100 times — randomness may be broken'
        );
    }
}
