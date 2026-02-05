# web-game-1

A web-based game project powered by Codex.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m game.app
```

The API runs on `http://localhost:8000`.

## Game flow & mechanics (current)

This project follows a three-stage flow:

1. **账号入口** → 注册/登录，进入角色管理。
2. **角色管理** → 创建/删除角色（当前后端为单角色模式，前端已按多角色设计规划）。
3. **核心玩法** → 修炼、历练、挑战、灵宠四大模块循环成长。

### Core loop
- 历练产出资源 → 用于修炼/灵宠养成 → 战力提升 → 解锁更高阶玩法与稀有资源。
- 无商城/无付费入口，资源 100% 通过历练与挑战产出。

### Systems roadmap (aligned to design doc)
- **修炼**：境界突破（练气→筑基→金丹→元婴→化神→炼虚→合体→大乘→渡劫），突破失败概率随境界提升。
- **历练**：场景解锁+时长选择+随机事件+灵宠捕捉触发。
- **挑战**：秘境 BOSS / 同门竞技（AI）/ 渡劫挑战。
- **灵宠**：捕捉、出战绑定、升级、洗髓、进阶、羁绊加成。
- **道具体系**：捕捉/养成/增益/材料道具，全历练产出。

> 详细机制请参考 `docs/xiuxian_game_design.md`，后续实现将逐步对齐该文档。

## Documentation

- [修仙网页游戏（NAS 部署）设计草案](docs/xiuxian_game_design.md)
