import json

import pytest

from game import config
from game.app import create_app
from game.storage import json_store


@pytest.fixture()
def client(tmp_path, monkeypatch):
    data_file = tmp_path / "players.json"
    data_file.write_text(json.dumps({"users": {}, "players": {}, "pets": {}}, ensure_ascii=False))
    monkeypatch.setattr(config, "DATA_FILE", data_file)
    monkeypatch.setattr(json_store, "DATA_FILE", data_file)

    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def _register_and_login(client, username: str) -> str:
    response = client.post("/auth/register", json={"username": username, "password": "secret"})
    assert response.status_code == 200
    response = client.post("/auth/login", json={"username": username, "password": "secret"})
    assert response.status_code == 200
    return response.get_json()["token"]


def _auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_full_flow(client):
    token = _register_and_login(client, "alice")

    response = client.post("/player/create", json={"name": "小青"}, headers=_auth_headers(token))
    assert response.status_code == 200
    player_id = response.get_json()["player_id"]
    assert player_id

    response = client.post("/cultivation/train", headers=_auth_headers(token))
    assert response.status_code == 200

    response = client.post("/event/explore", headers=_auth_headers(token))
    assert response.status_code == 200

    response = client.post("/challenge/pve", headers=_auth_headers(token))
    assert response.status_code == 200

    response = client.post("/pet/capture", headers=_auth_headers(token))
    assert response.status_code == 200
    pet_id = response.get_json()["pet_id"]

    response = client.post("/pet/upgrade", json={"pet_id": pet_id}, headers=_auth_headers(token))
    assert response.status_code == 200

    response = client.post("/pet/evolve", json={"pet_id": pet_id}, headers=_auth_headers(token))
    assert response.status_code == 200
    options = response.get_json()["options"]
    choice = options[0][0]

    response = client.post(
        "/pet/evolve",
        json={"pet_id": pet_id, "choice": choice},
        headers=_auth_headers(token),
    )
    assert response.status_code == 200

    token_bob = _register_and_login(client, "bob")
    response = client.post("/player/create", json={"name": "阿强"}, headers=_auth_headers(token_bob))
    assert response.status_code == 200
    opponent_id = response.get_json()["player_id"]

    response = client.post(
        "/challenge/pvp",
        json={"opponent_id": opponent_id},
        headers=_auth_headers(token),
    )
    assert response.status_code == 200
