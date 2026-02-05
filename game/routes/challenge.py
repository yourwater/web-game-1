from flask import Blueprint, jsonify, request

from game.routes import require_auth
from game.services.combat_service import pve_battle, pvp_battle
from game.services.player_service import get_player

challenge_bp = Blueprint("challenge", __name__)


@challenge_bp.post("/pve")
@require_auth
def pve(user):
    try:
        player = get_player(user["user_id"])
        result = pve_battle(player["player_id"])
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(result)


@challenge_bp.post("/pvp")
@require_auth
def pvp(user):
    payload = request.get_json(force=True)
    opponent_id = payload.get("opponent_id")
    if not opponent_id:
        return jsonify({"error": "缺少对手ID"}), 400
    try:
        player = get_player(user["user_id"])
        result = pvp_battle(player["player_id"], opponent_id)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(result)
