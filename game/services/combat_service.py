import random

from game.services.player_service import update_player
from game.storage.json_store import load_data


def _simulate_damage(attacker: dict, defender: dict) -> int:
    base = max(1, attacker["stats"]["atk"] - defender["stats"]["def"])
    return base + random.randint(0, 3)


def pve_battle(player_id: str) -> dict:
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")
    monster = {
        "name": "妖兽",
        "stats": {"hp": 80 + player["level"] * 5, "atk": 8 + player["level"], "def": 5},
    }
    player_hp = player["stats"]["hp"]
    monster_hp = monster["stats"]["hp"]
    while player_hp > 0 and monster_hp > 0:
        monster_hp -= _simulate_damage(player, monster)
        if monster_hp <= 0:
            break
        player_hp -= _simulate_damage(monster, player)
    victory = player_hp > 0
    reward = {"spirit_stones": 15, "exp": 10} if victory else {"exp": 2}
    updated = update_player(
        player_id,
        {
            "spirit_stones": player["spirit_stones"] + reward.get("spirit_stones", 0),
            "exp": player["exp"] + reward.get("exp", 0),
        },
    )
    return {"victory": victory, "reward": reward, "player": updated}


def pvp_battle(player_id: str, opponent_id: str) -> dict:
    data = load_data()
    player = data["players"].get(player_id)
    opponent = data["players"].get(opponent_id)
    if not player or not opponent:
        raise ValueError("角色不存在")
    player_score = player["stats"]["atk"] + player["stats"]["def"] + random.randint(0, 10)
    opponent_score = opponent["stats"]["atk"] + opponent["stats"]["def"] + random.randint(0, 10)
    victory = player_score >= opponent_score
    reward = {"spirit_stones": 20} if victory else {"spirit_stones": 5}
    updated = update_player(
        player_id,
        {"spirit_stones": player["spirit_stones"] + reward["spirit_stones"]},
    )
    return {"victory": victory, "reward": reward, "player": updated}
