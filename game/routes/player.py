from flask import Blueprint, jsonify, request

from game.routes import require_auth
from game.services.player_service import create_player, delete_player, get_player

player_bp = Blueprint("player", __name__)


@player_bp.get("/me")
@require_auth
def me(user):
    try:
        player = get_player(user["user_id"])
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(player)


@player_bp.post("/create")
@require_auth
def create(user):
    payload = request.get_json(force=True)
    name = payload.get("name")
    if not name:
        return jsonify({"error": "缺少角色名"}), 400
    try:
        player = create_player(user["user_id"], name)
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
