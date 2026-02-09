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
docker run -d --name web-game-1 -p 8200:80 web-game-1
```

### 使用剧情映射（推荐）

将宿主机的 `story.json` 映射到容器内，后续补充剧情无需重建镜像：

```bash
docker run -d --name web-game-1 \
  -p 8200:80 \
  -v /volume1/docker/game-wz1/data/story.json:/usr/share/nginx/html/data/story.json:ro \
  web-game-1
```

若希望替换全部静态资源，也可以直接映射整个目录：

```bash
docker run -d --name web-game-1 \
  -p 8200:80 \
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

### 语音朗读

- 页面右上角提供“朗读：开/关”按钮，使用浏览器内置的 Web Speech API 进行自动朗读。  
- 若浏览器不支持语音朗读，可选择自行录音并作为音频放入 `data/audio/`，再在剧情中配置 `music`（或扩展为单独的 `voice` 字段）。  
- 如果你希望采用完整的语音文件方案，可以告诉我目录结构与命名规范，我可以继续改造成“自动播放录音”的版本。

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
