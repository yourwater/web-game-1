import random

from game.services.player_service import update_player
from game.storage.json_store import load_data

EVENT_POOL = [
    ("spirit_stones", 20, "获得灵石"),
    ("exp", 15, "获得修为"),
    ("battle", 1, "遭遇妖兽"),
    ("pet", 1, "发现灵宠踪迹"),
]


def explore_event(player_id: str) -> dict:
    event = random.choice(EVENT_POOL)
    if event[0] == "spirit_stones":
        data = load_data()
        player = data["players"].get(player_id)
        if not player:
            raise ValueError("角色不存在")
        stones = player["spirit_stones"] + event[1]
        player = update_player(player_id, {"spirit_stones": stones})
        return {"event": event[2], "reward": {"spirit_stones": event[1]}, "player": player}
    if event[0] == "exp":
        data = load_data()
        player = data["players"].get(player_id)
        if not player:
            raise ValueError("角色不存在")
        exp = player["exp"] + event[1]
        player = update_player(player_id, {"exp": exp})
        return {"event": event[2], "reward": {"exp": event[1]}, "player": player}
    if event[0] == "battle":
        return {"event": event[2], "reward": {}, "battle": True}
    return {"event": event[2], "reward": {}, "pet_hint": True}
