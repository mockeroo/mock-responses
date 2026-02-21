<?php

declare(strict_types=1);

namespace Mockeroo\MockResponses;

/**
 * An HTTP status code paired with a randomly chosen sarcastic message.
 */
final class Response
{
    public function __construct(
        public readonly int $status,
        public readonly string $message,
    ) {}

    public function __toString(): string
    {
        return sprintf('Response{status=%d, message="%s"}', $this->status, $this->message);
    }
}
