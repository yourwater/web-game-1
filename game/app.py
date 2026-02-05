from flask import Flask, jsonify

from game.config import SECRET_KEY
from game.routes import register_blueprints


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SECRET_KEY"] = SECRET_KEY

    register_blueprints(app)

    @app.get("/")
    def index():
        return jsonify({"message": "修仙游戏 API 运行中"})

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(host="0.0.0.0", port=8000)
