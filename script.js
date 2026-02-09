let story = {};

const state = {
  current: "prologue",
};

const titleEl = document.getElementById("sceneTitle");
const metaEl = document.getElementById("sceneMeta");
const textEl = document.getElementById("sceneText");
const choicesEl = document.getElementById("choices");

const saveSlotButtons = [
  document.getElementById("saveSlot1"),
  document.getElementById("saveSlot2"),
  document.getElementById("saveSlot3"),
];
const loadSlotButtons = [
  document.getElementById("loadSlot1"),
  document.getElementById("loadSlot2"),
  document.getElementById("loadSlot3"),
];
const exportBtn = document.getElementById("exportSave");
const importBtn = document.getElementById("importSave");
const importFile = document.getElementById("importFile");
const restartBtn = document.getElementById("restartBtn");

const autosaveKey = "fogHarborAutosave";

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

  localStorage.setItem(autosaveKey, id);
}

function saveSlot(slotIndex) {
  const key = `fogHarborSlot${slotIndex}`;
  localStorage.setItem(key, state.current);
  alert(`已保存到存档 ${slotIndex}`);
}

function loadSlot(slotIndex) {
  const key = `fogHarborSlot${slotIndex}`;
  const saved = localStorage.getItem(key);
  if (saved && story[saved]) {
    renderScene(saved);
    alert(`已读取存档 ${slotIndex}`);
  } else {
    alert(`没有找到存档 ${slotIndex}`);
  }
}

function exportSaves() {
  const payload = {
    current: state.current,
    autosave: localStorage.getItem(autosaveKey),
    slots: {
      1: localStorage.getItem("fogHarborSlot1"),
      2: localStorage.getItem("fogHarborSlot2"),
      3: localStorage.getItem("fogHarborSlot3"),
    },
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "fog-harbor-save.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importSaves(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (payload?.autosave) {
        localStorage.setItem(autosaveKey, payload.autosave);
      }
      if (payload?.slots) {
        Object.entries(payload.slots).forEach(([slot, value]) => {
          if (value) {
            localStorage.setItem(`fogHarborSlot${slot}`, value);
          }
        });
      }
      if (payload?.current && story[payload.current]) {
        renderScene(payload.current);
      } else {
        const autosave = localStorage.getItem(autosaveKey);
        if (autosave && story[autosave]) {
          renderScene(autosave);
        }
      }
      alert("存档已导入。");
    } catch (error) {
      alert("导入失败：文件格式不正确。");
    }
  };
  reader.readAsText(file);
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

saveSlotButtons.forEach((button, index) => {
  button.addEventListener("click", () => saveSlot(index + 1));
});

loadSlotButtons.forEach((button, index) => {
  button.addEventListener("click", () => loadSlot(index + 1));
});

exportBtn.addEventListener("click", exportSaves);
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  importSaves(file);
  importFile.value = "";
});

restartBtn.addEventListener("click", restartGame);

loadStory();
