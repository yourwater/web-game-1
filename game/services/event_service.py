import random

from game.services.player_service import update_player
from game.storage.json_store import load_data, save_data

EVENT_POOL = [
    ("spirit_stones", 20, "获得灵石"),
    ("exp", 15, "获得修为"),
    ("battle", 1, "遭遇妖兽"),
    ("pet", 1, "偶遇灵兽"),
]

ITEM_POOL = [
    ("凝气丹", 0.3),
    ("淬体丹", 0.15),
    ("破障丹", 0.1),
    ("诱兽香", 0.12),
    ("灵宠口粮", 0.25),
]


def explore_event(player_id: str) -> dict:
    event = random.choice(EVENT_POOL)
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")
    if event[0] == "spirit_stones":
        stones = player["spirit_stones"] + event[1]
        player = update_player(player_id, {"spirit_stones": stones})
        return {"event": event[2], "reward": {"spirit_stones": event[1]}, "player": player}
    if event[0] == "exp":
        exp = player["exp"] + event[1]
        player = update_player(player_id, {"exp": exp})
        return {"event": event[2], "reward": {"exp": event[1]}, "player": player}
    if event[0] == "battle":
        monster_hp = 60 + player["level"] * 4
        damage_taken = random.randint(5, 15)
        victory = random.random() > 0.3
        reward = {"spirit_stones": 10, "exp": 8} if victory else {"exp": 3}
        player = update_player(
            player_id,
            {
                "spirit_stones": player["spirit_stones"] + reward.get("spirit_stones", 0),
                "exp": player["exp"] + reward.get("exp", 0),
            },
        )
        return {
            "event": event[2],
            "battle": True,
            "victory": victory,
            "damage_taken": damage_taken,
            "monster_hp": monster_hp,
            "reward": reward,
            "player": player,
        }

    items = []
    for item, chance in ITEM_POOL:
        if random.random() < chance:
            items.append(item)
    if items:
        inventory = player.get("inventory", {})
        for item in items:
            inventory[item] = inventory.get(item, 0) + 1
        player["inventory"] = inventory
        data["players"][player_id] = player
        save_data(data)
    return {"event": event[2], "reward": {}, "pet_hint": True, "items": items}
