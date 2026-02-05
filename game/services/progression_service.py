import random

from game.config import REALM_ORDER
from game.services.player_service import update_player
from game.storage.json_store import load_data


def train_player(player_id: str) -> dict:
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")

    gain = random.randint(5, 15)
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
