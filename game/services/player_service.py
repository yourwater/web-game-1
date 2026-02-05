import time
import uuid

from game.config import REALM_ORDER
from game.storage.json_store import load_data, save_data


def create_player(user_id: str, name: str) -> dict:
    data = load_data()
    user = data["users"].get(user_id)
    if not user:
        raise ValueError("用户不存在")
    if user.get("player_id"):
        raise ValueError("该账号已创建角色")

    player_id = f"player_{uuid.uuid4().hex[:8]}"
    data["players"][player_id] = {
        "name": name,
        "level": 1,
        "realm": REALM_ORDER[0],
        "exp": 0,
        "spirit_stones": 100,
        "stats": {"hp": 100, "atk": 10, "def": 8, "spd": 8},
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
