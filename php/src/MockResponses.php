<?php

declare(strict_types=1);

namespace Mockeroo\MockResponses;

/**
 * Sarcastic HTTP status code responses for testing and development.
 *
 * Mirrors the behaviour of the @mockeroo/mock-responses npm package.
 *
 * Example:
 *
 *   use Mockeroo\MockResponses\MockResponses;
 *
 *   $resp = MockResponses::getResponse(404);
 *   if ($resp !== null) {
 *       echo "{$resp->status}: {$resp->message}\n";
 *   }
 *
 *   $codes = MockResponses::getAvailableCodes();
 *   print_r($codes); // [200, 201, 204, ...]
 *
 * Response data is loaded from the canonical responses/*.json files at class
 * initialisation time. When installed via Composer the library falls back from
 * a bundled responses/ directory to the monorepo sibling directory automatically.
 */
final class MockResponses
{
    /** @var array<int, list<string>> */
    private static array $responses = [];

    /** @var list<int> */
    private static array $codes = [];

    private static bool $initialized = false;

    private function __construct() {}

    private static function initialize(): void
    {
        if (self::$initialized) {
            return;
        }

        // When installed as a Composer package, a bundled responses/ directory
        // sits next to src/. In the monorepo, fall back to ../responses/.
        $bundled  = dirname(__DIR__) . '/responses';
        $monorepo = dirname(__DIR__, 2) . '/responses';
        $dir = is_dir($bundled) ? $bundled : $monorepo;

        foreach (glob($dir . '/*.json') as $file) {
            $code     = (int) basename($file, '.json');
            $messages = json_decode(file_get_contents($file), true);
            if (!empty($messages)) {
                self::$responses[$code] = $messages;
            }
        }

        ksort(self::$responses);
        self::$codes = array_keys(self::$responses);
        self::$initialized = true;
    }

    /**
     * Returns a Response with a random sarcastic message for the given HTTP
     * status code, or null if the code is not recognised.
     */
    public static function getResponse(int $statusCode): ?Response
    {
        self::initialize();

        if (!isset(self::$responses[$statusCode])) {
            return null;
        }

        $messages = self::$responses[$statusCode];
        return new Response($statusCode, $messages[array_rand($messages)]);
    }

    /**
     * Returns all supported HTTP status codes in ascending order.
     * Each call returns a new array so callers may modify it freely.
     *
     * @return list<int>
     */
    public static function getAvailableCodes(): array
    {
        self::initialize();
        return self::$codes;
    }
}
