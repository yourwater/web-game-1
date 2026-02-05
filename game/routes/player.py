from flask import Blueprint, jsonify, request

from game.routes import require_auth
from game.services.player_service import create_player, delete_player, get_player
from game.services.progression_service import exp_required

player_bp = Blueprint("player", __name__)


@player_bp.get("/me")
@require_auth
def me(user):
    try:
        player = get_player(user["user_id"])
        player["exp_required"] = exp_required(player["level"])
        root_count = len(player.get("root_elements", [])) or 1
        root_multiplier = {
            1: 1.3,
            2: 1.15,
            3: 1.0,
            4: 0.9,
            5: 0.8,
        }.get(root_count, 1.0)
        player["bonus_training_multiplier"] = max(0, root_multiplier - 1.0)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(player)


@player_bp.post("/create")
@require_auth
def create(user):
    payload = request.get_json(force=True)
    name = payload.get("name")
    root_elements = payload.get("root_elements")
    avatar = payload.get("avatar")
    if not name:
        return jsonify({"error": "缺少角色名"}), 400
    try:
        player = create_player(user["user_id"], name, root_elements=root_elements, avatar=avatar)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(player)


@player_bp.post("/delete")
@require_auth
def delete(user):
    try:
        delete_player(user["user_id"])
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify({"message": "角色已删除"})
