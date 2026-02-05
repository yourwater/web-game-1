import random
import time
import uuid

from game.config import REALM_ORDER
from game.storage.json_store import load_data, save_data


def _random_root_elements() -> list[str]:
    elements = ["金", "木", "水", "火", "土"]
    root_count = random.choices([1, 2, 3, 4, 5], weights=[0.15, 0.25, 0.3, 0.2, 0.1])[0]
    return random.sample(elements, k=root_count)


def create_player(user_id: str, name: str, root_elements: list[str] | None = None, avatar: str | None = None) -> dict:
    data = load_data()
    user = data["users"].get(user_id)
    if not user:
        raise ValueError("用户不存在")
    if user.get("player_id"):
        raise ValueError("该账号已创建角色")

    player_id = f"player_{uuid.uuid4().hex[:8]}"
    if root_elements:
        elements = ["金", "木", "水", "火", "土"]
        filtered = [element for element in root_elements if element in elements]
        root_elements = list(dict.fromkeys(filtered))
    if not root_elements:
        root_elements = _random_root_elements()
    data["players"][player_id] = {
        "name": name,
        "level": 1,
        "realm": REALM_ORDER[0],
        "exp": 0,
        "spirit_stones": 100,
        "root_elements": root_elements,
        "avatar": avatar or "male",
        "stats": {"hp": 100, "max_hp": 100, "atk": 10, "def": 8, "spd": 8},
        "inventory": {"捕兽绳": 5},
        "bound_pet_id": None,
        "training_until": None,
        "exploring_until": None,
        "pets": [],
        "created_at": int(time.time()),
        "last_active": int(time.time()),
    }
    user["player_id"] = player_id
    save_data(data)
    return {"player_id": player_id, **data["players"][player_id]}


def delete_player(user_id: str) -> None:
    data = load_data()
    user = data["users"].get(user_id)
    if not user or not user.get("player_id"):
        raise ValueError("无可删除的角色")
    player_id = user["player_id"]
    player = data["players"].pop(player_id, None)
    if player:
        for pet_id in list(player.get("pets", [])):
            data["pets"].pop(pet_id, None)
    user["player_id"] = None
    save_data(data)


def get_player(user_id: str) -> dict:
    data = load_data()
    user = data["users"].get(user_id)
    if not user or not user.get("player_id"):
        raise ValueError("请先创建角色")
    player = data["players"].get(user["player_id"])
    if not player:
        raise ValueError("角色不存在")
    return {"player_id": user["player_id"], **player}


def update_player(player_id: str, updates: dict) -> dict:
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")
    player.update(updates)
    player["last_active"] = int(time.time())
    save_data(data)
    return {"player_id": player_id, **player}
