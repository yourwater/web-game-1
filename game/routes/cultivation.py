from flask import Blueprint, jsonify

from game.routes import require_auth
from game.services.player_service import get_player
from game.services.progression_service import train_player

cultivation_bp = Blueprint("cultivation", __name__)


@cultivation_bp.post("/train")
@require_auth
def train(user):
    try:
        player = get_player(user["user_id"])
        updated = train_player(player["player_id"])
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify({"player": updated, "message": "修炼完成"})
