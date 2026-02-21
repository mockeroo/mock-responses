//! Sarcastic HTTP status code responses for testing and development.
//!
//! Mirrors the behaviour of the `@mockeroo/mock-responses` npm package.
//!
//! # Example
//!
//! ```rust
//! use mockeroo_mock_responses::{get_response, get_available_codes};
//!
//! if let Some(resp) = get_response(404) {
//!     println!("{} — {}", resp.status, resp.message);
//! }
//!
//! let codes = get_available_codes();
//! println!("Supported codes: {:?}", codes);
//! ```

use rand::seq::SliceRandom;

include!(concat!(env!("OUT_DIR"), "/responses_data.rs"));

/// An HTTP status code paired with a randomly chosen sarcastic message.
pub struct Response {
    pub status: u16,
    pub message: &'static str,
}

/// Returns a [`Response`] with a random sarcastic message for the given HTTP
/// status code, or `None` if the code is not recognised.
pub fn get_response(status_code: u16) -> Option<Response> {
    let messages = RESPONSES
        .iter()
        .find(|(code, _)| *code == status_code)
        .map(|(_, msgs)| *msgs)?;

    let message = messages.choose(&mut rand::thread_rng())?;
    Some(Response {
        status: status_code,
        message,
    })
}

/// Returns all supported HTTP status codes in ascending order.
pub fn get_available_codes() -> Vec<u16> {
    RESPONSES.iter().map(|(code, _)| *code).collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn known_code_returns_response() {
        let resp = get_response(200).expect("expected response for 200");
        assert_eq!(resp.status, 200);
        assert!(!resp.message.is_empty());
    }

    #[test]
    fn unknown_code_returns_none() {
        assert!(get_response(999).is_none());
    }

    #[test]
    fn all_available_codes_return_responses() {
        for code in get_available_codes() {
            let resp = get_response(code)
                .unwrap_or_else(|| panic!("get_response({code}) returned None but code is listed as available"));
            assert_eq!(resp.status, code);
            assert!(!resp.message.is_empty(), "empty message for code {code}");
        }
    }

    #[test]
    fn available_codes_not_empty() {
        assert!(!get_available_codes().is_empty());
    }

    #[test]
    fn available_codes_are_sorted() {
        let codes = get_available_codes();
        for w in codes.windows(2) {
            assert!(w[0] < w[1], "codes not sorted: {} followed by {}", w[0], w[1]);
        }
    }

    #[test]
    fn available_codes_contains_expected() {
        let codes: HashSet<u16> = get_available_codes().into_iter().collect();
        for expected in [200, 201, 204, 400, 401, 403, 404, 500] {
            assert!(codes.contains(&expected), "expected code {expected} to be available");
        }
    }

    #[test]
    fn responses_are_varied() {
        // 404 has 10+ messages; after 100 draws we expect more than one unique message.
        let seen: HashSet<&str> = (0..100)
            .filter_map(|_| get_response(404))
            .map(|r| r.message)
            .collect();
        assert!(
            seen.len() > 1,
            "get_response(404) returned the same message 100 times — randomness may be broken"
        );
    }
}
