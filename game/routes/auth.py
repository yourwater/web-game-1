from flask import Blueprint, jsonify, request

from game.services.auth_service import login_user, logout_user, register_user
from game.routes import require_auth

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    payload = request.get_json(force=True)
    username = payload.get("username")
    password = payload.get("password")
    if not username or not password:
        return jsonify({"error": "缺少用户名或密码"}), 400
    try:
        user = register_user(username, password)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(user)


@auth_bp.post("/login")
def login():
    payload = request.get_json(force=True)
    username = payload.get("username")
    password = payload.get("password")
    if not username or not password:
        return jsonify({"error": "缺少用户名或密码"}), 400
    try:
        result = login_user(username, password)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(result)


@auth_bp.post("/logout")
@require_auth
def logout(user):
    logout_user(user["user_id"])
    return jsonify({"message": "已注销"})
