# web-game-1

一个可部署在 NAS 的中文文字冒险小游戏（纯静态站点）。剧情内容与容器分离，可通过挂载 `data/story.json` 随时更新。

## 本地运行

```bash
python -m http.server 8200
```

然后访问：`http://localhost:8200`。

> 提示：即使未放入任何音乐文件，游戏仍可正常游玩；只是音乐按钮不会播放。

## Docker 部署

构建镜像：

```bash
docker build -t web-game-1 .
```

运行容器（默认带内置剧情）：

```bash
docker run -d --name web-game-1 -p 8200:8200 web-game-1
```

### 使用剧情映射（推荐）

将宿主机的 `story.json` 映射到容器内，后续补充剧情无需重建镜像：

```bash
docker run -d --name web-game-1 \
  -p 8200:8200 \
  -v /volume1/docker/game-wz1/data/story.json:/usr/share/nginx/html/data/story.json:ro \
  web-game-1
```

若希望替换全部静态资源，也可以直接映射整个目录：

```bash
docker run -d --name web-game-1 \
  -p 8200:8200 \
  -v /volume1/docker/game-wz1:/usr/share/nginx/html:ro \
  web-game-1
```

浏览器访问：`http://<NAS_IP>:8200`。

> 若网页无法正常运行，请确认容器端口映射为 `-p 8200:8200`，并确保 NAS 防火墙放行 8200 端口。

## 存档说明

- 游戏会自动保存最近进度（浏览器本地存储）。
- 可在页面右上角手动保存/读取进度。

## 音乐与语音

### 背景音乐

- 将音频文件放到 `data/audio/` 目录（例如：`data/audio/fog-harbor-theme.mp3`）。
- 在 `data/story.json` 的对应场景里配置 `music` 字段，例如：  
  `"music": "data/audio/fog-harbor-theme.mp3"`
- 页面右上角提供“音乐：开/关”按钮控制播放。
- 当前内置剧情示例引用的文件名如下（放在 `data/audio/`）：  
  - `fog-harbor-theme.mp3`  
  - `lighthouse-wind.mp3`  
  - `archive-hum.mp3`  
  - `tide-echo.mp3`  
  - `bell-awakening.mp3`  
  - `quiet-fog.mp3`

### 语音朗读

- 页面右上角提供“朗读：开/关”按钮，使用浏览器内置的 Web Speech API 进行自动朗读。  
- 若浏览器不支持语音朗读，可选择自行录音并作为音频放入 `data/audio/`，再在剧情中配置 `music`（或扩展为单独的 `voice` 字段）。  
- 如果你希望采用完整的语音文件方案，可以告诉我目录结构与命名规范，我可以继续改造成“自动播放录音”的版本。

### 背景音乐与音效分层建议（推荐）

> 不需要每一章都更换背景乐。推荐用 **3~6 条背景音乐** 覆盖“情绪段落”，再在关键场景叠加 **短音效** 增强变化。

#### 背景音乐分组（示例）

| 情绪段落 | 章节范围 | 建议背景乐文件名 | 音乐风格建议 |
| --- | --- | --- | --- |
| 港口 / 迷雾探索 | 序章 + 第 1~4 章 | fog-harbor-theme.mp3 | 雾气感、缓慢海风、铺垫感 |
| 灯塔 / 潮汐节奏 | 第 5~6 章 | lighthouse-wind.mp3 | 灯塔风声、清亮长音 |
| 档案室 / 回廊线索 | 第 7~13 章 | archive-hum.mp3 | 低鸣、纸张、回廊混响 |
| 影子 / 真相逼近 | 第 14~18 章 | tide-echo.mp3 | 深水回声、紧张拉伸 |
| 沉钟 / 高潮推进 | 第 19~24 章 | bell-awakening.mp3 | 低沉钟声、唤醒感 |
| 结局 B（放下） | endingRelease | quiet-fog.mp3 | 安静、放下、余韵 |

#### 关键音效（可选）

| 场景 ID | 触发点建议 | 音效文件名（建议） | 风格说明 |
| --- | --- | --- | --- |
| tideWait | 潮汐钟声出现时 | sfx-tide-bell.mp3 | 清脆钟声、远处回响 |
| archiveEntrance | 推门进入档案室 | sfx-door-creak.mp3 | 木门轻响、年代感 |
| hallway | 回廊低语出现 | sfx-whisper.mp3 | 低语氛围、轻微气流 |
| bellClue | 走近沉钟区 | sfx-deep-rumble.mp3 | 低频轰鸣、海底压迫 |
| bellOne | 第一声钟响 | sfx-bell-hit.mp3 | 低沉钟鸣、厚重 |
| bellThree | 第三声钟响 | sfx-bell-awaken.mp3 | 钟声扩散、明亮回响 |

#### 朗读文件命名（可选）

> 若你想使用“录音版朗读”，建议统一命名为：  
> `voice-<scene-id>.mp3`（例如：`voice-prologue.mp3`、`voice-dock.mp3`）。  
> 录音内容建议朗读 **「标题 + 正文」**，对应 `data/story.json` 中同名章节的 `title` 与 `text` 字段。

### Docker 拉取失败（无法访问 Docker Hub）

如果出现类似错误：

```
Get "https://registry-1.docker.io/v2/": net/http: request canceled while waiting for connection
```

说明 NAS 无法访问 Docker Hub。可选择以下方案之一：

1. **配置镜像加速器**（推荐）
   - 在 NAS 的 Docker 设置中添加镜像源（如企业/自建镜像仓库或国内加速源）。
   - 重新执行 `docker build`。

2. **离线导入基础镜像**
   - 在可联网的机器上执行：
     ```bash
     docker pull nginx:1.27-alpine
     docker save -o nginx-1.27-alpine.tar nginx:1.27-alpine
     ```
   - 将 `nginx-1.27-alpine.tar` 拷贝到 NAS：
     ```bash
     docker load -i nginx-1.27-alpine.tar
     ```
   - 再回到项目目录执行 `docker build`。

3. **使用私有镜像仓库**
   - 将 `nginx:1.27-alpine` 推送到你可访问的私有仓库，然后修改 `Dockerfile` 的 `FROM` 为私有仓库地址。
