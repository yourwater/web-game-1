const apiBase = "";
const logEl = document.getElementById("log");
const statusEl = document.getElementById("status");
const playerInfoEl = document.getElementById("playerInfo");
const progressInfoEl = document.getElementById("progressInfo");
const battleInfoEl = document.getElementById("battleInfo");
const petInfoEl = document.getElementById("petInfo");

const tokenKey = "xiuxian_token";
let token = localStorage.getItem(tokenKey);

function setStatus(text) {
  statusEl.textContent = text;
}

function log(message, payload) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  const time = new Date().toLocaleTimeString();
  entry.textContent = `${time} · ${message}`;
  if (payload) {
    entry.textContent += ` → ${JSON.stringify(payload)}`;
  }
  logEl.prepend(entry);
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "请求失败");
  }
  return data;
}

function updatePlayerInfo(data) {
  playerInfoEl.textContent = JSON.stringify(data, null, 2);
}

function updateProgressInfo(data) {
  progressInfoEl.textContent = JSON.stringify(data, null, 2);
}

function updateBattleInfo(data) {
  battleInfoEl.textContent = JSON.stringify(data, null, 2);
}

function updatePetInfo(data) {
  petInfoEl.textContent = JSON.stringify(data, null, 2);
}

function attachButton(id, handler) {
  document.getElementById(id).addEventListener("click", handler);
}

attachButton("register", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    log("注册成功", data);
  } catch (error) {
    log(`注册失败: ${error.message}`);
  }
});

attachButton("login", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    token = data.token;
    localStorage.setItem(tokenKey, token);
    setStatus(`已登录：${username}`);
    log("登录成功", data);
  } catch (error) {
    log(`登录失败: ${error.message}`);
  }
});

attachButton("logout", async () => {
  try {
    await request("/auth/logout", { method: "POST" });
  } catch (error) {
    log(`注销失败: ${error.message}`);
  }
  token = null;
  localStorage.removeItem(tokenKey);
  setStatus("未登录");
});

attachButton("createPlayer", async () => {
  const name = document.getElementById("playerName").value;
  try {
    const data = await request("/player/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    updatePlayerInfo(data);
    log("创建角色成功", data);
  } catch (error) {
    log(`创建角色失败: ${error.message}`);
  }
});

attachButton("getPlayer", async () => {
  try {
    const data = await request("/player/me", { method: "GET" });
    updatePlayerInfo(data);
    log("获取角色信息成功", data);
  } catch (error) {
    log(`获取角色失败: ${error.message}`);
  }
});

attachButton("deletePlayer", async () => {
  try {
    const data = await request("/player/delete", { method: "POST" });
    updatePlayerInfo(data);
    log("删除角色成功", data);
  } catch (error) {
    log(`删除角色失败: ${error.message}`);
  }
});

attachButton("train", async () => {
  try {
    const data = await request("/cultivation/train", { method: "POST" });
    updateProgressInfo(data);
    log("修炼完成", data);
  } catch (error) {
    log(`修炼失败: ${error.message}`);
  }
});

attachButton("explore", async () => {
  try {
    const data = await request("/event/explore", { method: "POST" });
    updateProgressInfo(data);
    log("历练完成", data);
  } catch (error) {
    log(`历练失败: ${error.message}`);
  }
});

attachButton("pve", async () => {
  try {
    const data = await request("/challenge/pve", { method: "POST" });
    updateBattleInfo(data);
    log("PVE 完成", data);
  } catch (error) {
    log(`PVE 失败: ${error.message}`);
  }
});

attachButton("pvp", async () => {
  const opponentId = document.getElementById("opponentId").value;
  try {
    const data = await request("/challenge/pvp", {
      method: "POST",
      body: JSON.stringify({ opponent_id: opponentId }),
    });
    updateBattleInfo(data);
    log("PVP 完成", data);
  } catch (error) {
    log(`PVP 失败: ${error.message}`);
  }
});

attachButton("capturePet", async () => {
  try {
    const data = await request("/pet/capture", { method: "POST" });
    updatePetInfo(data);
    log("捕捉灵宠成功", data);
  } catch (error) {
    log(`捕捉灵宠失败: ${error.message}`);
  }
});

attachButton("upgradePet", async () => {
  const petId = document.getElementById("petId").value;
  try {
    const data = await request("/pet/upgrade", {
      method: "POST",
      body: JSON.stringify({ pet_id: petId }),
    });
    updatePetInfo(data);
    log("灵宠升级成功", data);
  } catch (error) {
    log(`灵宠升级失败: ${error.message}`);
  }
});

attachButton("getEvolveOptions", async () => {
  const petId = document.getElementById("petId").value;
  try {
    const data = await request("/pet/evolve", {
      method: "POST",
      body: JSON.stringify({ pet_id: petId }),
    });
    updatePetInfo(data);
    if (data.options && data.options.length) {
      document.getElementById("evolveChoice").value = data.options[0][0];
    }
    log("获取进化选项成功", data);
  } catch (error) {
    log(`获取进化选项失败: ${error.message}`);
  }
});

attachButton("evolvePet", async () => {
  const petId = document.getElementById("petId").value;
  const choice = document.getElementById("evolveChoice").value;
  try {
    const data = await request("/pet/evolve", {
      method: "POST",
      body: JSON.stringify({ pet_id: petId, choice }),
    });
    updatePetInfo(data);
    log("进化完成", data);
  } catch (error) {
    log(`进化失败: ${error.message}`);
  }
});

if (token) {
  setStatus("已登录");
} else {
  setStatus("未登录");
}
