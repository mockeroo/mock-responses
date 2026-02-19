import json
import random
import pathlib


def _find_responses_dir() -> pathlib.Path:
    # When installed from PyPI: responses are bundled into mock_responses/data/
    bundled = pathlib.Path(__file__).parent / "data"
    if bundled.exists() and any(bundled.glob("*.json")):
        return bundled
    # In the monorepo: python/mock_responses/ -> python/ -> repo root -> responses/
    monorepo = pathlib.Path(__file__).parent.parent.parent / "responses"
    if monorepo.exists():
        return monorepo
    raise FileNotFoundError(
        "Cannot find the responses directory. "
        "If installed from PyPI this is a packaging issue. "
        "If developing locally, run from the repository root."
    )


def _load_responses() -> dict[int, list[str]]:
    responses: dict[int, list[str]] = {}
    for f in _find_responses_dir().glob("*.json"):
        responses[int(f.stem)] = json.loads(f.read_text(encoding="utf-8"))
    return responses


_responses: dict[int, list[str]] = _load_responses()
_available_codes: list[int] = sorted(_responses)


def get_response(status_code: int | str) -> dict | None:
    """
    Get a random sarcastic response for a given HTTP status code.
    Returns {"status": int, "message": str}, or None if the code is not available.
    """
    try:
        code = int(status_code)
    except (TypeError, ValueError):
        return None

    if code not in _responses:
        return None

    return {"status": code, "message": random.choice(_responses[code])}


def get_available_codes() -> list[int]:
    """Return all available HTTP status codes, sorted ascending."""
    return _available_codes
