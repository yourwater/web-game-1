import random

from game.config import REALM_ORDER
from game.services.player_service import update_player
from game.storage.json_store import load_data


def train_player(player_id: str) -> dict:
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")

    root_count = len(player.get("root_elements", [])) or 1
    root_multiplier = {
        1: 1.3,
        2: 1.15,
        3: 1.0,
        4: 0.9,
        5: 0.8,
    }.get(root_count, 1.0)
    gain = int(random.randint(5, 15) * root_multiplier)
    exp = player["exp"] + gain
    level = player["level"]
    realm_index = REALM_ORDER.index(player["realm"])

    if exp >= 100:
        exp -= 100
        level += 1
        if level % 5 == 0 and realm_index < len(REALM_ORDER) - 1:
            realm_index += 1
    stats = player["stats"].copy()
    stats["hp"] += 5
    stats["atk"] += 1
    stats["def"] += 1

    return update_player(
        player_id,
        {
            "exp": exp,
            "level": level,
            "realm": REALM_ORDER[realm_index],
            "stats": stats,
        },
    )
