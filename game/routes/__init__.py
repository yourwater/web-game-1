from functools import wraps

from flask import Blueprint, jsonify, request

from game.services.auth_service import get_user_by_token


def require_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split("Bearer ", 1)[1].strip()
        if not token:
            token = request.args.get("token") or request.json.get("token") if request.is_json else None
        user = get_user_by_token(token)
        if not user:
            return jsonify({"error": "未授权"}), 401
        return func(user, *args, **kwargs)

    return wrapper


def register_blueprints(app):
    from game.routes.auth import auth_bp
    from game.routes.player import player_bp
    from game.routes.cultivation import cultivation_bp
    from game.routes.event import event_bp
    from game.routes.challenge import challenge_bp
    from game.routes.pet import pet_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(player_bp, url_prefix="/player")
    app.register_blueprint(cultivation_bp, url_prefix="/cultivation")
    app.register_blueprint(event_bp, url_prefix="/event")
    app.register_blueprint(challenge_bp, url_prefix="/challenge")
    app.register_blueprint(pet_bp, url_prefix="/pet")
