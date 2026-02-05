from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_FILE = DATA_DIR / "players.json"

SECRET_KEY = "dev-secret-change-me"

REALM_ORDER = ["炼气", "筑基", "金丹", "元婴", "化神", "返虚"]

PET_RARITY = ["R", "SR", "SSR"]
PET_BASE_STATS = {
    "R": {"hp": 30, "atk": 8, "def": 6, "spd": 6},
    "SR": {"hp": 40, "atk": 12, "def": 8, "spd": 8},
    "SSR": {"hp": 55, "atk": 16, "def": 10, "spd": 10},
}

EVOLUTION_SUCCESS_RATE = {
    1: 0.9,
    2: 0.9,
    3: 0.7,
    4: 0.7,
    5: 0.5,
    6: 0.3,
}

EVOLUTION_BONUS_POOL = [
    ("crit_rate", 0.02),
    ("lifesteal", 0.02),
    ("evasion", 0.02),
    ("damage_bonus", 0.03),
    ("shield", 5),
]

MAX_EVOLUTION_STAGE = 6
