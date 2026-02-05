import random
import time

from game.config import REALM_ORDER
from game.services.pet_service import apply_pet_exp
from game.services.player_service import update_player
from game.storage.json_store import load_data, save_data


def exp_required(level: int) -> int:
    return 80 + (level - 1) * 25 + (level // 5) * 40


def train_player(player_id: str) -> dict:
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")
    now = int(time.time())
    if player.get("exploring_until") and now < player["exploring_until"]:
        raise ValueError("正在历练中，无法修炼")
    training_until = player.get("training_until")
    if training_until and now < training_until:
        return {"status": "training", "available_in": training_until - now, "player": player}

    root_count = len(player.get("root_elements", [])) or 1
    root_multiplier = {
        1: 1.3,
        2: 1.15,
        3: 1.0,
        4: 0.9,
        5: 0.8,
    }.get(root_count, 1.0)
    if not training_until or now >= training_until:
        if training_until:
            gain = int(random.randint(5, 15) * root_multiplier)
            exp = player["exp"] + gain
            level = player["level"]
            realm_index = REALM_ORDER.index(player["realm"])
            required = exp_required(level)

            while exp >= required:
                exp -= required
                level += 1
                required = exp_required(level)
                if level % 5 == 0 and realm_index < len(REALM_ORDER) - 1:
                    realm_index += 1
            stats = player["stats"].copy()
            stats["hp"] += 5
            stats["max_hp"] += 5
            stats["atk"] += 1
            stats["def"] += 1
            heal_amount = 8 + level * 2
            stats["hp"] = min(stats["max_hp"], stats["hp"] + heal_amount)
            updates = {
                "exp": exp,
                "level": level,
                "realm": REALM_ORDER[realm_index],
                "stats": stats,
                "training_until": None,
            }
            apply_pet_exp(player_id, gain)
            return update_player(player_id, updates)

        training_seconds = 10
        player["training_until"] = now + training_seconds
        data["players"][player_id] = player
        save_data(data)
        return {"status": "started", "available_in": training_seconds, "player": player}
    return update_player(player_id, {})
