import time
import uuid
from typing import Optional

from werkzeug.security import check_password_hash, generate_password_hash

from game.storage.json_store import load_data, save_data


def register_user(username: str, password: str) -> dict:
    data = load_data()
    if any(user["username"] == username for user in data["users"].values()):
        raise ValueError("用户名已存在")
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    data["users"][user_id] = {
        "username": username,
        "password_hash": generate_password_hash(password),
        "player_id": None,
        "created_at": int(time.time()),
        "token": None,
    }
    save_data(data)
    return {"user_id": user_id, "username": username}


def login_user(username: str, password: str) -> dict:
    data = load_data()
    for user_id, user in data["users"].items():
        if user["username"] == username:
            if not check_password_hash(user["password_hash"], password):
                raise ValueError("密码错误")
            token = uuid.uuid4().hex
            user["token"] = token
            save_data(data)
            return {"token": token, "user_id": user_id}
    raise ValueError("用户不存在")


def logout_user(user_id: str) -> None:
    data = load_data()
    user = data["users"].get(user_id)
    if user:
        user["token"] = None
        save_data(data)


def get_user_by_token(token: str) -> Optional[dict]:
    if not token:
        return None
    data = load_data()
    for user_id, user in data["users"].items():
        if user.get("token") == token:
            return {"user_id": user_id, **user}
    return None
