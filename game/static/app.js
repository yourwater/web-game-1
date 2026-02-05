const apiBase = "";
const logEl = document.getElementById("log");
const logPanel = document.getElementById("logPanel");
const statusEl = document.getElementById("status");
const playerInfoEl = document.getElementById("playerInfo");
const progressInfoEl = document.getElementById("progressInfo");
const exploreInfoEl = document.getElementById("exploreInfo");
const battleInfoEl = document.getElementById("battleInfo");
const petInfoEl = document.getElementById("petInfo");
const playerBarEl = document.getElementById("playerBar");
const authSection = document.getElementById("authSection");
const roleSection = document.getElementById("roleSection");
const gameSection = document.getElementById("gameSection");

const tokenKey = "xiuxian_token";
let token = localStorage.getItem(tokenKey);
let currentPlayer = null;
let loginFailures = 0;
let lockedUntil = null;

function setStatus(text) {
  statusEl.textContent = text;
}

function log(message, payload, isError = false) {
  const entry = document.createElement("div");
  entry.className = `log-entry${isError ? " error" : ""}`;
  const time = new Date().toLocaleTimeString();
  let content = `${time} · 【修仙日志】${message}`;
  if (payload && typeof payload === "string") {
    content += `：${payload}`;
  }
  entry.textContent = content;
  logEl.prepend(entry);
  while (logEl.children.length > 100) {
    logEl.removeChild(logEl.lastChild);
  }
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

function formatPlayer(player) {
  if (!player) {
    return "尚未获取角色信息。";
  }
  const roots = player.root_elements ? player.root_elements.join("、") : "未知";
  return [
    `昵称：${player.name}`,
    `境界：${player.realm} · 等级：${player.level}`,
    `修为：${player.exp} · 灵石：${player.spirit_stones}`,
    `灵根：${roots}`,
    `属性：攻击 ${player.stats.atk} / 防御 ${player.stats.def} / 生命 ${player.stats.hp} / 速度 ${player.stats.spd}`,
    `灵宠数量：${player.pets.length}`,
    `角色ID：${player.player_id}`,
  ].join("\n");
}

function updatePlayerInfo(player) {
  playerInfoEl.textContent = formatPlayer(player);
  if (player) {
    playerBarEl.textContent = `当前角色：${player.name} · ${player.realm} · Lv.${player.level} · 灵石 ${player.spirit_stones}`;
  } else {
    playerBarEl.textContent = "尚未进入修仙。";
  }
}

function updateProgressInfo(data) {
  if (!data || !data.player) {
    progressInfoEl.textContent = "暂无修炼信息。";
    return;
  }
  const player = data.player;
  progressInfoEl.textContent = [
    "修炼完成。",
    `当前境界：${player.realm} · 等级：${player.level}`,
    `修为：${player.exp} · 灵石：${player.spirit_stones}`,
    `属性：攻击 ${player.stats.atk} / 防御 ${player.stats.def} / 生命 ${player.stats.hp}`,
  ].join("\n");
}

function updateExploreInfo(data) {
  if (!data) {
    exploreInfoEl.textContent = "暂无历练结果。";
    return;
  }
  const rewards = data.reward || {};
  const rewardText = Object.keys(rewards)
    .map((key) => `${key === "spirit_stones" ? "灵石" : "修为"}+${rewards[key]}`)
    .join("、");
  exploreInfoEl.textContent = [
    `历练事件：${data.event}`,
    rewardText ? `奖励：${rewardText}` : "奖励：暂无",
  ].join("\n");
}

function updateBattleInfo(data) {
  if (!data) {
    battleInfoEl.textContent = "暂无挑战结果。";
    return;
  }
  const reward = data.reward || {};
  const rewardText = Object.keys(reward)
    .map((key) => `${key === "spirit_stones" ? "灵石" : "修为"}+${reward[key]}`)
    .join("、");
  battleInfoEl.textContent = [
    `战斗结果：${data.victory ? "胜利" : "失败"}`,
    rewardText ? `奖励：${rewardText}` : "奖励：暂无",
  ].join("\n");
}

function updatePetInfo(data) {
  if (!data) {
    petInfoEl.textContent = "暂无灵宠信息。";
    return;
  }
  if (data.options) {
    petInfoEl.textContent = [
      "进化选项：",
      ...data.options.map((option) => `- ${option[0]} +${option[1]}`),
    ].join("\n");
    return;
  }
  petInfoEl.textContent = [
    `灵宠：${data.name} · ${data.rarity}`,
    `等级：${data.level} · 进化阶段：${data.evolution_stage}`,
    `属性：攻击 ${data.base_stats.atk} / 防御 ${data.base_stats.def} / 生命 ${data.base_stats.hp}`,
  ].join("\n");
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
    log(`账号 ${data.username} 注册成功`);
  } catch (error) {
    log(`注册失败：${error.message}`, null, true);
  }
});

attachButton("login", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (lockedUntil && Date.now() < lockedUntil) {
    log("登录失败：已锁定，请稍后再试", null, true);
    return;
  }
  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    token = data.token;
    localStorage.setItem(tokenKey, token);
    setStatus(`已登录：${username}`);
    log(`账号 ${username} 登录成功`);
    loginFailures = 0;
    lockedUntil = null;
    showSection("role");
    await refreshPlayer();
  } catch (error) {
    loginFailures += 1;
    if (loginFailures >= 5) {
      lockedUntil = Date.now() + 10 * 60 * 1000;
    }
    log(`登录失败：${error.message}`, null, true);
  }
});

attachButton("logout", async () => {
  try {
    await request("/auth/logout", { method: "POST" });
  } catch (error) {
    log(`注销失败：${error.message}`, null, true);
  }
  token = null;
  localStorage.removeItem(tokenKey);
  setStatus("未登录");
  currentPlayer = null;
  updatePlayerInfo(null);
  showSection("auth");
  log("账号已退出");
});

attachButton("createPlayer", async () => {
  const name = document.getElementById("playerName").value;
  const avatar = document.getElementById("avatar").value;
  const rootElements = randomRootElements();
  try {
    const data = await request("/player/create", {
      method: "POST",
      body: JSON.stringify({ name, root_elements: rootElements, avatar }),
    });
    currentPlayer = data;
    updatePlayerInfo(currentPlayer);
    log(`角色 ${data.name} 创建成功，灵根：${rootElements.join("、")}`);
  } catch (error) {
    log(`创建角色失败：${error.message}`, null, true);
  }
});

attachButton("getPlayer", async () => {
  await refreshPlayer();
});

attachButton("deletePlayer", async () => {
  try {
    const data = await request("/player/delete", { method: "POST" });
    currentPlayer = null;
    updatePlayerInfo(null);
    log("角色已删除");
  } catch (error) {
    log(`删除角色失败：${error.message}`, null, true);
  }
});

attachButton("train", async () => {
  try {
    const data = await request("/cultivation/train", { method: "POST" });
    updateProgressInfo(data);
    log("修炼完成");
  } catch (error) {
    log(`修炼失败：${error.message}`, null, true);
  }
});

attachButton("explore", async () => {
  try {
    const data = await request("/event/explore", { method: "POST" });
    updateExploreInfo(data);
    log("历练完成");
  } catch (error) {
    log(`历练失败：${error.message}`, null, true);
  }
});

attachButton("pve", async () => {
  try {
    const data = await request("/challenge/pve", { method: "POST" });
    updateBattleInfo(data);
    log("挑战妖兽完成");
  } catch (error) {
    log(`PVE 失败：${error.message}`, null, true);
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
    log("玩家对战完成");
  } catch (error) {
    log(`PVP 失败：${error.message}`, null, true);
  }
});

attachButton("capturePet", async () => {
  try {
    const data = await request("/pet/capture", { method: "POST" });
    updatePetInfo(data);
    log(`捕捉灵宠成功：${data.name}`);
  } catch (error) {
    log(`捕捉灵宠失败：${error.message}`, null, true);
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
    log("灵宠升级成功");
  } catch (error) {
    log(`灵宠升级失败：${error.message}`, null, true);
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
    log("获取进化选项成功");
  } catch (error) {
    log(`获取进化选项失败：${error.message}`, null, true);
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
    log("进化完成");
  } catch (error) {
    log(`进化失败：${error.message}`, null, true);
  }
});

async function refreshPlayer() {
  try {
    const data = await request("/player/me", { method: "GET" });
    currentPlayer = data;
    updatePlayerInfo(currentPlayer);
    log(`角色 ${data.name} 已载入`);
    return data;
  } catch (error) {
    updatePlayerInfo(null);
    log(`获取角色失败：${error.message}`, null, true);
    return null;
  }
}

function showSection(section) {
  authSection.style.display = section === "auth" ? "block" : "none";
  roleSection.style.display = section === "role" ? "block" : "none";
  gameSection.style.display = section === "game" ? "block" : "none";
}

function randomRootElements() {
  const elements = ["金", "木", "水", "火", "土"];
  const weights = [0.15, 0.25, 0.3, 0.2, 0.1];
  const counts = [1, 2, 3, 4, 5];
  const roll = Math.random();
  let acc = 0;
  let rootCount = 3;
  for (let i = 0; i < counts.length; i += 1) {
    acc += weights[i];
    if (roll <= acc) {
      rootCount = counts[i];
      break;
    }
  }
  return elements.sort(() => 0.5 - Math.random()).slice(0, rootCount);
}

document.getElementById("enterGame").addEventListener("click", async () => {
  const player = await refreshPlayer();
  if (player) {
    showSection("game");
  }
});

document.getElementById("backToRoles").addEventListener("click", () => {
  showSection("role");
});

document.getElementById("toggleLog").addEventListener("click", () => {
  logPanel.classList.toggle("collapsed");
  const isCollapsed = logPanel.classList.contains("collapsed");
  document.getElementById("toggleLog").textContent = isCollapsed ? "展开" : "收起";
});

document.getElementById("clearLog").addEventListener("click", () => {
  logEl.innerHTML = "";
});

document.getElementById("toggleSound").addEventListener("click", (event) => {
  const isOn = event.target.textContent.includes("开");
  event.target.textContent = `音效：${isOn ? "关" : "开"}`;
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
  });
});

if (token) {
  setStatus("已登录");
  showSection("auth");
} else {
  setStatus("未登录");
  showSection("auth");
}
