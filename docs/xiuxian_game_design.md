# 修仙网页游戏（NAS 部署）设计草案

> 目标：在群晖 NAS 上以 Docker 方式部署一个多人可访问的轻量网页修仙游戏；支持注册/登录、创建唯一角色、修炼/历练/挑战/玩家对战/灵宠系统，并具备可扩展的数据与业务层结构。

## 1. 目录结构建议（与现有规划一致）

```
/docker/xiuxian-game/
│
├─ data/                     # ❗持久化数据（挂载目录）
│   └─ players.json
│
├─ game/                     # ❗游戏程序（逻辑层）
│   ├─ app.py                # Web 入口（Flask 启动）
│   ├─ config.py             # 配置（路径、常量）
│   ├─ routes/               # Web 路由层
│   │   ├─ __init__.py
│   │   └─ player.py
│   ├─ services/             # 业务逻辑层
│   │   ├─ __init__.py
│   │   └─ player_service.py
│   └─ storage/              # 数据读写层
│       ├─ __init__.py
│       └─ json_store.py
│
├─ Dockerfile
└─ requirements.txt
```

> 建议补充：
> - `game/routes/auth.py`：注册/登录/注销。
> - `game/routes/pet.py`：灵宠相关操作。
> - `game/services/combat_service.py`：PVE/PVP 战斗逻辑。
> - `game/services/pet_service.py`：灵宠捕捉/培养/进化。
> - `game/services/progression_service.py`：修炼/境界成长。
> - `game/services/event_service.py`：历练事件池。

## 2. 核心数据模型（JSON 结构草案）

为简化部署与备份，先以 `players.json` 作为单一数据文件（后续可扩展为 SQLite）。

### 2.1 用户与角色

```json
{
  "users": {
    "user_123": {
      "username": "alice",
      "password_hash": "...",
      "player_id": "player_123",
      "created_at": 1700000000
    }
  },
  "players": {
    "player_123": {
      "name": "小青",
      "level": 5,
      "realm": "炼气",
      "exp": 120,
      "spirit_stones": 320,
      "stats": {
        "hp": 120,
        "atk": 18,
        "def": 12,
        "spd": 10
      },
      "pets": ["pet_001"],
      "created_at": 1700000000,
      "last_active": 1700001000
    }
  },
  "pets": {
    "pet_001": {
      "name": "灵狐",
      "rarity": "SR",
      "level": 3,
      "evolution_stage": 1,
      "base_stats": {
        "hp": 40,
        "atk": 12,
        "def": 8,
        "spd": 9
      },
      "bonus_stats": {
        "crit_rate": 0.05,
        "lifesteal": 0.02
      },
      "owner_id": "player_123"
    }
  }
}
```

### 2.2 关键字段说明

- **realm（境界）**：炼气 → 筑基 → 金丹 → 元婴 → 化神 → 返虚（后续可扩展）。
- **spirit_stones（灵石）**：通用经济单位（挑战/历练/任务/出售获取）。
- **stats**：基础属性，决定战斗与成长。
- **pets**：玩家可持有多个灵宠，但当前出战灵宠可限制为 1 个（增强策略性）。

## 3. 功能模块与玩法

### 3.1 账户/角色

- 注册/登录。
- 每个账号 **只能创建一个角色**。
- 角色可删除（进入冷却期防误删）。

### 3.2 修炼（成长）

- **修炼消耗时间或资源**，获得经验与突破材料。
- 经验积累满后可突破境界（可能失败，失败获得少量返还）。
- 境界影响基础属性与可挑战内容。

### 3.3 历练（随机事件）

- 事件池机制：
  - 收获灵石、装备材料
  - 遭遇妖兽（战斗）
  - 获得灵宠捕捉机会
- 冷却时间限制，防刷。

### 3.4 挑战（PVE）

- 关卡/副本模式：难度与境界挂钩。
- 产出：经验、灵石、材料。
- 可挂机模式（定期结算）。

### 3.5 玩家对战（PVP）

- 排行榜机制，按战力或胜率排序。
- 每日挑战次数限制。
- 失败也能获得少量奖励。

### 3.6 灵宠系统

#### 3.6.1 获取方式
- 捕捉（历练事件触发）。
- 购买（商店）。

#### 3.6.2 培养/升级
- 消耗材料/灵石升级。
- 每级提高基础属性。

#### 3.6.3 进化系统（核心玩法）

- **进化次数限制**：例如每只灵宠最多 6 次进化。
- 每次进化提供 **3 个随机附加属性** 供选择（如暴击率、吸血、闪避、增伤等）。
- 进化成功率随次数递增而下降：
  - 第 1~2 次：90%
  - 第 3~4 次：70%
  - 第 5 次：50%
  - 第 6 次：30%
- 失败惩罚：
  - 进化失败不会掉级，但消耗材料。
  - 可设置“保底机制”：失败 3 次后提升成功率。

#### 3.6.4 平衡性建议
- 属性上限：单项附加属性有上限。
- 属性曲线：进化带来的增幅为递减收益。
- 稀有度影响成长上限但不完全碾压：
  - R/SR/SSR 灵宠基础值不同，但进化空间相近。

## 4. 技术实现建议

### 4.1 Flask 路由层

- `/auth/register`：注册
- `/auth/login`：登录
- `/player/me`：查看角色信息
- `/player/create`：创建角色
- `/player/delete`：删除角色
- `/cultivation/train`：修炼
- `/event/explore`：历练
- `/challenge/pve`：挑战
- `/challenge/pvp`：玩家对战
- `/pet/capture`：捕捉灵宠
- `/pet/upgrade`：灵宠升级
- `/pet/evolve`：灵宠进化

### 4.2 服务层与数据层职责

- **routes**：请求参数校验、鉴权、返回 JSON。
- **services**：业务逻辑与规则处理。
- **storage**：数据读写抽象（JSON 或后续改为 SQLite）。

## 5. 后续扩展

- UI 前端：可使用 Vue/React 接入。
- 数据库迁移：从 JSON 切换到 SQLite / Postgres。
- 任务系统：每日任务、周任务。
- 装备系统：武器/法宝/符箓等。
- 社交系统：宗门/好友/聊天。

## 6. 初期 MVP 建议

1. 账号注册/登录。
2. 角色创建/删除。
3. 修炼（经验成长）。
4. 历练（随机奖励）。
5. 简易灵宠捕捉 + 升级。

> 以上为 MVP，确保可玩性后再逐步增加 PVP 与复杂进化机制。
