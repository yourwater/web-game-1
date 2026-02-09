# web-game-1

一个可部署在 NAS 的中文文字冒险小游戏（纯静态站点）。

## 本地运行

```bash
python -m http.server 8000
```

然后访问：`http://localhost:8000`。

## Docker 部署

构建镜像：

```bash
docker build -t web-game-1 .
```

运行容器：

```bash
docker run -d --name web-game-1 -p 8080:80 web-game-1
```

浏览器访问：`http://<NAS_IP>:8080`。
