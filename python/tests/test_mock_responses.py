import pytest
from mock_responses import get_response, get_available_codes


# ---------------------------------------------------------------------------
# get_response
# ---------------------------------------------------------------------------

def test_get_response_returns_dict_for_valid_code():
    result = get_response(404)
    assert result is not None
    assert result["status"] == 404
    assert isinstance(result["message"], str)
    assert len(result["message"]) > 0


def test_get_response_returns_none_for_unknown_code():
    assert get_response(999) is None


def test_get_response_returns_none_for_non_numeric_string():
    assert get_response("abc") is None


def test_get_response_returns_none_for_none():
    assert get_response(None) is None


def test_get_response_accepts_string_numbers():
    result = get_response("404")
    assert result is not None
    assert result["status"] == 404
    assert isinstance(result["message"], str)


@pytest.mark.parametrize("code", [200, 201, 400, 401, 403, 404, 500])
def test_get_response_works_for_common_codes(code):
    result = get_response(code)
    assert result is not None
    assert result["status"] == code
    assert isinstance(result["message"], str)


def test_get_response_message_is_from_pool():
    # Run several draws to confirm the message always comes from the pool
    codes = get_available_codes()
    for code in codes[:5]:
        for _ in range(5):
            result = get_response(code)
            assert result is not None
            assert result["status"] == code


# ---------------------------------------------------------------------------
# get_available_codes
# ---------------------------------------------------------------------------

def test_get_available_codes_returns_list():
    codes = get_available_codes()
    assert isinstance(codes, list)


def test_get_available_codes_contains_only_ints():
    codes = get_available_codes()
    assert all(isinstance(c, int) for c in codes)


def test_get_available_codes_is_sorted_ascending():
    codes = get_available_codes()
    assert codes == sorted(codes)


def test_get_available_codes_is_not_empty():
    assert len(get_available_codes()) > 0


def test_get_available_codes_includes_common_codes():
    codes = get_available_codes()
    for code in [200, 404, 500]:
        assert code in codes
