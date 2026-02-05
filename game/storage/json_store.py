import json
import threading
from pathlib import Path

from game.config import DATA_FILE

_lock = threading.Lock()


def _ensure_file(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(json.dumps({"users": {}, "players": {}, "pets": {}}, ensure_ascii=False, indent=2))


def load_data() -> dict:
    with _lock:
        _ensure_file(DATA_FILE)
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def save_data(data: dict) -> None:
    with _lock:
        _ensure_file(DATA_FILE)
        DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
