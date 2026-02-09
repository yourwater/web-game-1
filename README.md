# web-game-1

一个可部署在 NAS 的中文文字冒险小游戏（纯静态站点）。剧情内容与容器分离，可通过挂载 `data/story.json` 随时更新。

## 本地运行

```bash
python -m http.server 8200
```

然后访问：`http://localhost:8200`。

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

### 章节音乐与朗读清单（建议规范）

> 下表给出 **每一章** 建议的音乐风格与可选录音文件名。  
> 录音内容建议朗读「标题 + 正文」，对应 `data/story.json` 中同名章节的 `title` 与 `text` 字段。

| 章节 | 场景 ID | 标题 | 建议音乐文件名 | 音乐风格建议 | 朗读文件名（可选） | 朗读内容说明 |
| --- | --- | --- | --- | --- | --- | --- |
| 序章 | prologue | 序章：雾港回声 | fog-harbor-theme.mp3 | 雾气感、缓慢海风、铺垫感 | voice-prologue.mp3 | 标题 + 正文 |
| 第 1 章 | dock | 第一章：潮湿的木板 | dock-mist.mp3 | 木板、潮湿、低频环境 | voice-dock.mp3 | 标题 + 正文 |
| 第 2 章 | lighthouse | 第一章：灯塔脚下 | lighthouse-wind.mp3 | 灯塔风声、清亮长音 | voice-lighthouse.mp3 | 标题 + 正文 |
| 第 3 章 | tavern | 第一章：港口酒馆 | tavern-warm.mp3 | 炉火、酒馆、温暖木质 | voice-tavern.mp3 | 标题 + 正文 |
| 第 4 章 | shipName | 第一章：退色的船名 | shipname-drift.mp3 | 旧船、回忆、轻微海浪 | voice-shipname.mp3 | 标题 + 正文 |
| 第 5 章 | askPast | 第一章：未说出口的旧事 | askpast-calm.mp3 | 平静、悬念、低音铺陈 | voice-askpast.mp3 | 标题 + 正文 |
| 第 6 章 | tideWait | 第一章：潮汐钟声 | tide-bell.mp3 | 钟声、潮汐、时间感 | voice-tidewait.mp3 | 标题 + 正文 |
| 第 7 章 | archiveEntrance | 第二章：旧档案室 | archive-hum.mp3 | 低鸣、纸张、回廊混响 | voice-archiveentrance.mp3 | 标题 + 正文 |
| 第 8 章 | companion | 第二章：同行的约定 | companion-quiet.mp3 | 低语、同行、压低情绪 | voice-companion.mp3 | 标题 + 正文 |
| 第 9 章 | archiveBook | 第二章：记录员的档案册 | archivebook-still.mp3 | 翻页感、微弱弦音 | voice-archivebook.mp3 | 标题 + 正文 |
| 第 10 章 | cabinet | 第二章：木柜之间 | cabinet-wood.mp3 | 木质空间、轻微回声 | voice-cabinet.mp3 | 标题 + 正文 |
| 第 11 章 | hallway | 第二章：回廊的低语 | hallway-whisper.mp3 | 低语、回廊、神秘感 | voice-hallway.mp3 | 标题 + 正文 |
| 第 12 章 | missingRecorder | 第二章：记录员失踪的夜晚 | missing-night.mp3 | 夜色、紧张、暗潮 | voice-missingrecorder.mp3 | 标题 + 正文 |
| 第 13 章 | askLetter | 第二章：信件的来处 | letter-reveal.mp3 | 暖色揭示、希望感 | voice-askletter.mp3 | 标题 + 正文 |
| 第 14 章 | cabinetDeep | 第二章：深柜 | cabinet-deep.mp3 | 更深层回声、低频 | voice-cabinetdeep.mp3 | 标题 + 正文 |
| 第 15 章 | shadowWriter | 第二章：影子写作者 | shadow-ink.mp3 | 影子、墨迹、幽暗 | voice-shadowwriter.mp3 | 标题 + 正文 |
| 第 16 章 | shadowReason | 第二章：影子的回答 | shadow-reason.mp3 | 真相、内省、沉稳 | voice-shadowreason.mp3 | 标题 + 正文 |
| 第 17 章 | hiddenNote | 第二章：夹页的便笺 | hiddennote-soft.mp3 | 轻启、微光、提示感 | voice-hiddennote.mp3 | 标题 + 正文 |
| 第 18 章 | writePage | 第二章：空白的记录 | writepage-warm.mp3 | 笔触、温暖、坚定 | voice-writepage.mp3 | 标题 + 正文 |
| 第 19 章 | bellClue | 第三章：沉钟区 | tide-echo.mp3 | 深水、回声、沉静 | voice-bellclue.mp3 | 标题 + 正文 |
| 第 20 章 | diveSolo | 第三章：独自下潜 | dive-solo.mp3 | 下潜、压力、深海感 | voice-divesolo.mp3 | 标题 + 正文 |
| 第 21 章 | diveTogether | 第三章：同行者 | dive-together.mp3 | 并行、互助、微光 | voice-divetogether.mp3 | 标题 + 正文 |
| 第 22 章 | tideWaitFinal | 第三章：最后的等待 | tide-wait-final.mp3 | 等待、张力、时间感 | voice-tidewaitfinal.mp3 | 标题 + 正文 |
| 第 23 章 | bellListen | 第三章：聆听 | bell-listen.mp3 | 细微回响、静谧 | voice-belllisten.mp3 | 标题 + 正文 |
| 第 24 章 | bellOne | 第三章：第一声钟 | bell-first.mp3 | 低沉钟声、唤醒感 | voice-bellone.mp3 | 标题 + 正文 |
| 终章 A | bellThree | 终章：三次回响 | bell-awakening.mp3 | 完整回响、释然 | voice-bellthree.mp3 | 标题 + 正文 |
| 终章 B | endingRelease | 终章：放下 | quiet-fog.mp3 | 安静、放下、余韵 | voice-endingrelease.mp3 | 标题 + 正文 |

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
