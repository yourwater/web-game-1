import random
import uuid

from game.config import (
    EVOLUTION_BONUS_POOL,
    EVOLUTION_SUCCESS_RATE,
    MAX_EVOLUTION_STAGE,
    PET_BASE_STATS,
    PET_RARITY,
)
from game.services.player_service import update_player
from game.storage.json_store import load_data, save_data


def list_pets(player_id: str) -> list[dict]:
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")
    pets = []
    for pet_id in player.get("pets", []):
        pet = data["pets"].get(pet_id)
        if pet:
            pets.append({"pet_id": pet_id, **pet})
    return pets


def capture_pet(player_id: str) -> dict:
    data = load_data()
    player = data["players"].get(player_id)
    if not player:
        raise ValueError("角色不存在")
    if len(player.get("pets", [])) >= 5:
        raise ValueError("灵宠背包已满")
    inventory = player.get("inventory", {})
    if inventory.get("捕兽绳", 0) <= 0:
        raise ValueError("捕兽绳不足")
    rarity = random.choices(PET_RARITY, weights=[0.7, 0.25, 0.05])[0]
    pet_id = f"pet_{uuid.uuid4().hex[:8]}"
    pet = {
        "name": f"灵宠{pet_id[-4:]}",
        "rarity": rarity,
        "level": 1,
        "evolution_stage": 0,
        "base_stats": PET_BASE_STATS[rarity].copy(),
        "bonus_stats": {},
        "owner_id": player_id,
        "evolution_failures": 0,
    }
    data["pets"][pet_id] = pet
    player["pets"].append(pet_id)
    inventory["捕兽绳"] = inventory.get("捕兽绳", 0) - 1
    player["inventory"] = inventory
    save_data(data)
    return {"pet_id": pet_id, **pet}


def upgrade_pet(player_id: str, pet_id: str) -> dict:
    data = load_data()
    pet = data["pets"].get(pet_id)
    if not pet or pet["owner_id"] != player_id:
        raise ValueError("灵宠不存在")
    pet["level"] += 1
    pet["base_stats"]["hp"] += 4
    pet["base_stats"]["atk"] += 2
    pet["base_stats"]["def"] += 1
    pet["base_stats"]["spd"] += 1
    save_data(data)
    return {"pet_id": pet_id, **pet}


def evolve_pet(player_id: str, pet_id: str, choice: str | None = None) -> dict:
    data = load_data()
    pet = data["pets"].get(pet_id)
    if not pet or pet["owner_id"] != player_id:
        raise ValueError("灵宠不存在")
    if pet["evolution_stage"] >= MAX_EVOLUTION_STAGE:
        raise ValueError("已达到进化上限")

    if not choice:
        options = random.sample(EVOLUTION_BONUS_POOL, k=3)
        pet["pending_evolution_options"] = options
        save_data(data)
        return {"pet_id": pet_id, "options": options}
    options = pet.get("pending_evolution_options")
    if not options:
        raise ValueError("请先获取进化选项")
    option_keys = [option[0] for option in options]
    if choice not in option_keys:
        raise ValueError("无效的进化属性")

    stage = pet["evolution_stage"] + 1
    success_rate = EVOLUTION_SUCCESS_RATE.get(stage, 0.3)
    if pet["evolution_failures"] >= 3:
        success_rate = min(1.0, success_rate + 0.2)

    if random.random() <= success_rate:
        bonus_key, bonus_value = next(option for option in options if option[0] == choice)
        pet["bonus_stats"][bonus_key] = pet["bonus_stats"].get(bonus_key, 0) + bonus_value
        pet["evolution_stage"] = stage
        pet["evolution_failures"] = 0
    else:
        pet["evolution_failures"] += 1
    pet.pop("pending_evolution_options", None)
    save_data(data)
    return {"pet_id": pet_id, **pet}
