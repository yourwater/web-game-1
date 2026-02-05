from flask import Blueprint, jsonify

from game.routes import require_auth
from game.services.event_service import explore_event
from game.services.player_service import get_player

event_bp = Blueprint("event", __name__)


@event_bp.post("/explore")
@require_auth
def explore(user):
    try:
        player = get_player(user["user_id"])
        result = explore_event(player["player_id"])
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(result)
