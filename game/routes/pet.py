from flask import Blueprint, jsonify, request

from game.routes import require_auth
from game.services.pet_service import capture_pet, evolve_pet, upgrade_pet
from game.services.player_service import get_player

pet_bp = Blueprint("pet", __name__)


@pet_bp.post("/capture")
@require_auth
def capture(user):
    try:
        player = get_player(user["user_id"])
        pet = capture_pet(player["player_id"])
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(pet)


@pet_bp.post("/upgrade")
@require_auth
def upgrade(user):
    payload = request.get_json(force=True)
    pet_id = payload.get("pet_id")
    if not pet_id:
        return jsonify({"error": "缺少灵宠ID"}), 400
    try:
        player = get_player(user["user_id"])
        pet = upgrade_pet(player["player_id"], pet_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(pet)


@pet_bp.post("/evolve")
@require_auth
def evolve(user):
    payload = request.get_json(force=True)
    pet_id = payload.get("pet_id")
    choice = payload.get("choice")
    if not pet_id:
        return jsonify({"error": "缺少灵宠ID"}), 400
    try:
        player = get_player(user["user_id"])
        result = evolve_pet(player["player_id"], pet_id, choice)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(result)
