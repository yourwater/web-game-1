let story = {};

const state = {
  current: "prologue",
};

const titleEl = document.getElementById("sceneTitle");
const metaEl = document.getElementById("sceneMeta");
const textEl = document.getElementById("sceneText");
const choicesEl = document.getElementById("choices");
const overlayEl = document.getElementById("sceneOverlay");
const bgmEl = document.getElementById("bgm");

const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const restartBtn = document.getElementById("restartBtn");
const toggleMusicBtn = document.getElementById("toggleMusic");
const toggleNarrationBtn = document.getElementById("toggleNarration");

const autosaveKey = "fogHarborAutosave";
const saveKey = "fogHarborSave";
const musicEnabledKey = "fogHarborMusicEnabled";
const narrationEnabledKey = "fogHarborNarrationEnabled";
let musicEnabled = localStorage.getItem(musicEnabledKey) === "true";
let narrationEnabled = localStorage.getItem(narrationEnabledKey) === "true";
let isNarrating = false;

function renderScene(id) {
  const scene = story[id];
  if (!scene) return;
  state.current = id;
  titleEl.textContent = scene.title;
  metaEl.textContent = scene.meta || "";
  textEl.textContent = scene.text;
  choicesEl.innerHTML = "";

  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = choice.label;
    btn.addEventListener("click", () => renderScene(choice.next));
    choicesEl.appendChild(btn);
  });

  applySceneMood(scene);
  updateMusic(scene);
  updateNarration(scene);
  localStorage.setItem(autosaveKey, id);
}

function applySceneMood(scene) {
  if (!overlayEl) return;
  if (scene.moodColor) {
    overlayEl.style.background = scene.moodColor;
    overlayEl.style.opacity = "1";
  } else {
    overlayEl.style.opacity = "0";
  }
}

function updateMusic(scene) {
  if (!bgmEl) return;
  const target = scene.music || "";
  if (!musicEnabled || !target) {
    bgmEl.pause();
    bgmEl.removeAttribute("src");
    return;
  }
  if (bgmEl.getAttribute("src") !== target) {
    bgmEl.setAttribute("src", target);
  }
  bgmEl.play().catch(() => {});
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    alert("当前浏览器不支持语音朗读。");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.onend = () => {
    isNarrating = false;
    updateNarrationButton();
  };
  isNarrating = true;
  updateNarrationButton();
  window.speechSynthesis.speak(utterance);
}

function stopNarration() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  isNarrating = false;
  updateNarrationButton();
}

function updateNarration(scene) {
  if (!narrationEnabled) return;
  speakText(`${scene.title}。${scene.text}`);
}

function updateMusicButton() {
  toggleMusicBtn.textContent = `音乐：${musicEnabled ? "开" : "关"}`;
}

function updateNarrationButton() {
  toggleNarrationBtn.textContent = `朗读：${narrationEnabled ? "开" : "关"}`;
}

function saveProgress() {
  localStorage.setItem(saveKey, state.current);
  alert("进度已保存。");
}

function loadProgress() {
  const saved = localStorage.getItem(saveKey);
  if (saved && story[saved]) {
    renderScene(saved);
    alert("进度已读取。");
  } else {
    alert("没有找到已保存的进度。");
  }
}

function restartGame() {
  if (confirm("确定要重新开始吗？")) {
    renderScene("prologue");
  }
}

async function loadStory() {
  try {
    const response = await fetch("data/story.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("剧情加载失败");
    }
    story = await response.json();
    const autosave = localStorage.getItem(autosaveKey);
    if (autosave && story[autosave]) {
      renderScene(autosave);
      return;
    }
    renderScene(state.current);
  } catch (error) {
    titleEl.textContent = "剧情加载失败";
    textEl.textContent = "无法读取 data/story.json，请确认剧情文件已挂载。";
    choicesEl.innerHTML = "";
  }
}

saveBtn.addEventListener("click", saveProgress);
loadBtn.addEventListener("click", loadProgress);
restartBtn.addEventListener("click", restartGame);

toggleMusicBtn.addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  localStorage.setItem(musicEnabledKey, String(musicEnabled));
  updateMusicButton();
  if (musicEnabled && story[state.current]) {
    updateMusic(story[state.current]);
  } else if (!musicEnabled) {
    bgmEl.pause();
  }
});

toggleNarrationBtn.addEventListener("click", () => {
  narrationEnabled = !narrationEnabled;
  localStorage.setItem(narrationEnabledKey, String(narrationEnabled));
  if (narrationEnabled && story[state.current]) {
    speakText(`${story[state.current].title}。${story[state.current].text}`);
  } else {
    stopNarration();
  }
});

updateMusicButton();
updateNarrationButton();
loadStory();

if (bgmEl) {
  bgmEl.addEventListener("error", () => {
    musicEnabled = false;
    localStorage.setItem(musicEnabledKey, "false");
    updateMusicButton();
  });
}
