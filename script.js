const defaultState = {
  nodeId: "prologue",
  stats: { bravery: 0, insight: 0, trust: 0 },
  inventory: [],
  flags: {}
};

const story = {
  prologue: {
    title: "序章：雾港来信",
    text: `你在深夜抵达雾港。船沿着幽深的河道靠岸，灯塔像一只巨兽的眼，在雾里缓缓转动。港口的钟声是这里的脉搏，你听见自己的名字被敲在风里，却又像被海水吞回。你收到的那封信只有一句话：“若想找回你遗失的名字，请在潮汐最低时进入雾港。”

码头上没有迎接的人。唯一的身影是一个穿长衣的港务员，他递给你一枚潮汐徽章和一本厚厚的《雾港航行日志》。徽章的背面刻着一句话：潮汐不是海的呼吸，而是城的梦。你从未听说过这样的城市，但心里却莫名地熟悉。

你知道要在天亮前找一处落脚地，也需要问清楚那位失踪的测绘师——信中提到的阿闻——最后出现的位置。雾在巷道间涌动，让港口像一座漂浮的迷宫。你握紧徽章，准备踏入这座城。`,
    choices: [
      { text: "先去客栈打听消息。", next: "inn", effects: { trust: 1 } },
      { text: "沿着灯塔方向寻找线索。", next: "lighthouse", effects: { bravery: 1 } },
      { text: "查看《雾港航行日志》中的旧地图。", next: "logbook", effects: { insight: 1 }, addItem: "航行日志" }
    ]
  },
  inn: {
    title: "第一章：潮汐客栈",
    text: `潮汐客栈隐藏在狭窄的巷道里，门口挂着倒置的航海钟。推门时铃声像潮水退去。掌柜是位戴着银链的老妇人，她的眼睛像两口深井，一眼就看穿你是外乡人。

你说起阿闻的名字，她停下擦杯的动作，告诉你他两周前住在顶层房间。那时他总带着一只塞满图纸的皮箱，说他在绘制“雾港的第二层地图”。老妇人压低声音，提醒你别再追问，因为雾港的秘密会把人拖入无底的水下。

你在客栈的大厅里坐下，听见不同桌上的人谈论潮汐、雾和“午夜列车”。有渔夫说午夜的海面上会出现隐形的码头；有修表匠说城里有一座倒过来的钟楼。你意识到这座城市不仅仅隐藏着阿闻，也可能藏着你自己的过去。`,
    choices: [
      { text: "上楼查看阿闻的旧房间。", next: "room", effects: { bravery: 1 } },
      { text: "向大厅里的修表匠打听倒钟楼。", next: "watchmaker", effects: { insight: 1 } },
      { text: "在柜台留下姓名换取线索。", next: "ledger", effects: { trust: 1 } }
    ]
  },
  lighthouse: {
    title: "第一章：灯塔之眼",
    text: `你沿着潮湿的石阶走向灯塔。海风撕扯着你的外衣，雾像厚毯压在海面。灯塔脚下有一间小屋，屋内点着一盏油灯，守塔人正在削木片。他看见你手里的潮汐徽章，露出迟疑的神情。

守塔人说他认识阿闻，那位测绘师曾在这里守了一夜，看着灯塔的光束像刀一样切开雾。他留下了一张写满符号的纸条，说“灯塔会在第三次潮汐时转向城市中心”。守塔人拒绝解释更多，只说这座灯塔不只指引船只，也在指引记忆。

你爬上灯塔的旋梯，站在最顶层。远处的城像一艘缓慢漂行的船。你突然感到胸口有一种隐隐的震动，像是有人在呼唤你回家。`,
    choices: [
      { text: "接受守塔人赠予的符号纸条。", next: "sigil", effects: { insight: 1 }, addItem: "符号纸条" },
      { text: "等到第三次潮汐再离开。", next: "thirdtide", effects: { bravery: 1 } },
      { text: "返回港口去找客栈。", next: "inn", effects: { trust: 1 } }
    ]
  },
  logbook: {
    title: "第一章：航行日志",
    text: `你翻开厚重的日志，纸页带着海盐的气味。第一页写着雾港的传说：这里建在旧海床上，城的下方是古老的航路。第二页是阿闻的笔迹，他写下“我找到了雾港的第二层，它存在于退潮与回潮之间”。

地图上标记了三个地点：潮汐客栈、旧档案馆、和“下沉的花园”。每个地点旁都有不同颜色的墨点，像是某种暗号。你感觉这本日志像是一扇门，打开它就会被潮水推往某个方向。

你决定带着日志前往旧档案馆，那也许是能解开阿闻失踪之谜的地方。`,
    choices: [
      { text: "前往旧档案馆。", next: "archive", effects: { insight: 1 } },
      { text: "先去客栈休整，再去档案馆。", next: "inn", effects: { trust: 1 } }
    ]
  },
  room: {
    title: "第二章：顶层房间",
    text: `阿闻住过的顶层房间还保留着原样。窗户被厚重的帘子挡住，空气里有潮湿的墨水味。你在床底找到一块刻着地图纹路的铜片，背面写着：“雾港的脉络藏在地下”。

桌上散落着他未完成的地图，城市被描绘成两层：上层是正常街巷，下层像一张倒影。你心里升起一个念头：阿闻或许进入了那个倒影，而你也可能要踏入它。

你翻到最后一页，发现一段写给“你”的话：如果你读到这里，说明你已被雾港选择。请不要害怕，信任你的脚步。`,
    choices: [
      { text: "带走铜片，去档案馆验证。", next: "archive", effects: { insight: 1 }, addItem: "铜片" },
      { text: "去找守塔人确认倒影之事。", next: "lighthouse", effects: { bravery: 1 } },
      { text: "返回大厅继续打听。", next: "inn", effects: { trust: 1 } }
    ]
  },
  watchmaker: {
    title: "第二章：修表匠的故事",
    text: `修表匠的手指细而稳，他说雾港的钟楼确实倒过来建，因为时间在这里是倒流的。他告诉你，阿闻曾请他修一只停摆的怀表，那表背面刻着“归途”。

“倒钟楼在城心广场的地下，”修表匠低声说，“只有在潮汐最低时，广场的石缝会打开。那里通往下层城。”他强调，你若去那里，就要带上能记住方向的东西，否则会迷失。

他递给你一枚停摆怀表，指针停在凌晨三点十五分。你感到指针像在等你推它继续转动。`,
    choices: [
      { text: "接受怀表，立即前往城心广场。", next: "plaza", effects: { bravery: 1 }, addItem: "停摆怀表" },
      { text: "先去档案馆确认倒钟楼传说。", next: "archive", effects: { insight: 1 } }
    ]
  },
  ledger: {
    title: "第二章：客栈账簿",
    text: `你在柜台留下姓名。老妇人拿出一本厚账簿，让你写下名字与来意。你犹豫地写下自己记得的名字，却发现字迹像被潮水冲刷，模糊不清。老妇人叹息：“雾港会暂时借走你的名字，但它会在合适的时刻还你。”

她告诉你一个秘密：阿闻曾把一封信寄存在她这里，收信人正是你。她将信交给你，信里写道：“在下沉花园的水榭，月光会照见你真正的名字。”

你把信收起，决定去找那座下沉花园。`,
    choices: [
      { text: "立刻去下沉花园。", next: "garden", effects: { bravery: 1 } },
      { text: "先去档案馆查资料，再去花园。", next: "archive", effects: { insight: 1 } }
    ]
  },
  archive: {
    title: "第三章：旧档案馆",
    text: `旧档案馆是一座被藤蔓包围的石楼，守门人是一位戴面具的女档案员。她检查你的徽章后放你进入。馆内堆满卷轴，空气里有尘土与潮气。

你找到了有关雾港的旧记载：城建于退潮之地，城民每隔十年会进行一次“记名仪式”，将自己的名字交给潮汐守护，换取城市的平安。阿闻在记录旁写了注释：“我怀疑仪式被扭曲，名字被用来打开下层城。”

档案员提醒你，下层城会让人忘记时间。她递给你一支“记忆笔”，说只要在手背写下目的，就不会迷失。你写下“找到阿闻，找回名字”，墨迹在皮肤上亮起微光。`,
    choices: [
      { text: "带着记忆笔前往城心广场。", next: "plaza", effects: { insight: 1 }, addItem: "记忆笔" },
      { text: "前往下沉花园寻找月光。", next: "garden", effects: { trust: 1 } },
      { text: "去港口查看午夜列车。", next: "train", effects: { bravery: 1 } }
    ]
  },
  sigil: {
    title: "第二章：符号纸条",
    text: `符号纸条上画着三个交叠的圆，像潮汐的波纹。纸条背面写着一句话：“找到三次潮汐之间的门”。你意识到这是进入下层城的钥匙。

当你把纸条放在灯塔的光束中时，符号发出微弱的蓝光，投影在墙上形成一道门的轮廓。门只维持了短短几秒，足够让你记住位置。

守塔人提醒你，进入下层城后不要相信自己的影子，因为影子会替你说话。`,
    choices: [
      { text: "立刻去城心广场寻找门。", next: "plaza", effects: { bravery: 1 } },
      { text: "先去下沉花园观察潮汐。", next: "garden", effects: { insight: 1 } }
    ]
  },
  thirdtide: {
    title: "第二章：第三次潮汐",
    text: `你在灯塔等待第三次潮汐。潮水在黑暗中一次次逼近又退去，仿佛在测试你的耐心。第三次潮汐来时，灯塔光束突然转向城心，你听见遥远的钟声倒响。

守塔人用手指划过你的手背，写下一个符号，“这代表门的开启。”他说，“你必须在钟声最尖锐时进入门，否则会被潮水洗去记忆。”

你攥紧符号，决定前往城心广场。`,
    choices: [
      { text: "赶往城心广场。", next: "plaza", effects: { bravery: 1 } }
    ]
  },
  plaza: {
    title: "第三章：城心广场",
    text: `城心广场像一只静止的漩涡，所有巷道都汇向此处。广场的石砖布满潮湿的裂纹，你在钟声中等待潮汐最低的时刻。当钟声倒数至第三下时，裂纹渗出淡蓝色的光，地面缓缓开启一道缝。

你看见一座倒置的钟楼在地下，钟摆向上摆动，像在牵引天空。下层城的风从裂缝涌出，带着陈旧的香气和低语。你能感觉到下层城在呼唤你的名字。

你深吸一口气，决定踏入地下。`,
    choices: [
      { text: "进入下层城。", next: "under", effects: { bravery: 1 } },
      { text: "先去下沉花园，准备之后再进入。", next: "garden", effects: { insight: 1 } }
    ]
  },
  garden: {
    title: "第三章：下沉花园",
    text: `下沉花园位于城外的低洼地，传说原本是贵族的温室，如今半沉在水里。你走过破碎的拱门，月光落在水面上，像碎裂的银。

水榭里有人影坐在琴旁，那人抬头时，你认出她是阿闻的同伴，名叫砚宁。她说阿闻确实进入了下层城，因为他相信那里藏着真正的雾港。她告诉你，月光会照见你真正的名字，而你的名字正是进入下层城的钥匙。

你在水面上看见自己的倒影，影子开口说了一个名字，那名字在你胸腔里震动。你记住它，却发现影子仍在低语：“别忘记，名字不是束缚，是回家的路。”`,
    choices: [
      { text: "带着名字前往城心广场。", next: "plaza", effects: { insight: 1 }, addItem: "真实名字" },
      { text: "与砚宁结伴同行。", next: "ally", effects: { trust: 1 } }
    ]
  },
  train: {
    title: "第三章：午夜列车",
    text: `港口边的铁轨延伸入雾中，你在午夜听见列车的汽笛。它像从海面升起，车窗里是模糊的人影。你登上列车，车厢里铺着旧地毯，墙上挂着雾港的旧照片。

列车员告诉你，这趟车只载记忆，它会在下层城的边界停靠。你坐在窗边，看见雾港的街道从上方滑过，仿佛你正在穿越一张折叠的地图。

当列车停下时，你在站台上看见阿闻留下的刻痕：一条向下的箭头和一句话：“如果你听见歌声，请不要回答。”`,
    choices: [
      { text: "沿箭头进入下层城。", next: "under", effects: { bravery: 1 } },
      { text: "返回城心广场再做决定。", next: "plaza", effects: { insight: 1 } }
    ]
  },
  ally: {
    title: "第四章：同伴砚宁",
    text: `砚宁背着琴，与您并肩走在潮湿的石道上。她说阿闻告诉她，雾港的真实地图是一首歌，而你可能是最后的音符。她愿意陪你进入下层城，但提醒你，她只能在两次钟声之间停留。

她把琴弦调成低音，弹出一段模糊的旋律。你发现旋律与潮汐的节奏吻合，像是打开一扇门的密码。你们约定：在最深处，如果你迷失，她会用琴声唤回你。

你们决定一同进入下层城。`,
    choices: [
      { text: "携同砚宁进入下层城。", next: "under", effects: { trust: 1 } }
    ]
  },
  under: {
    title: "第四章：下层城",
    text: `你踏入下层城，脚下的石阶像反过来的潮汐，向上延伸。这里的街道与上层城相同，却更安静，连你的呼吸都被雾吞噬。影子从墙上脱离，像另一个你。

你看到墙上刻着无数名字，每个名字都在微微发光，仿佛呼吸。你意识到这是“记名仪式”留下的痕迹，雾港用名字编织城市的边界。如果名字被带走，城市就会被遗忘。

远处传来歌声，你想起阿闻的提示。你闭嘴前进，来到一扇刻着潮汐符号的门前。门上有三处凹槽，像要你放入某种象征。`,
    choices: [
      { text: "用真实名字开启门。", next: "vault", effects: { insight: 1 } },
      { text: "用符号纸条对准凹槽。", next: "vault", effects: { bravery: 1 } },
      { text: "寻找其他入口，避开歌声。", next: "maze", effects: { bravery: 1 } }
    ]
  },
  maze: {
    title: "第四章：雾中迷廊",
    text: `你避开歌声，进入一条蜿蜒的迷廊。墙上挂着镜子，每面镜子都映出你不同的面孔：孩童的你、记忆中失落的你、尚未经历的你。你意识到时间在这里折叠，雾港在展示你的所有可能。

你凭着记忆笔上的字迹走过迷廊，但还是听见低低的歌声追随。你想起砚宁的琴声或者守塔人的告诫，终于在迷廊尽头看见一扇半开的门。

门缝后是一间储室，里面堆着被遗忘的行李和地图。你找到了阿闻的背包，里面有他写给你的最后一封信。`,
    choices: [
      { text: "阅读阿闻的信。", next: "letter", effects: { insight: 1 }, addItem: "阿闻的信" },
      { text: "带着背包去找主门。", next: "vault", effects: { bravery: 1 } }
    ]
  },
  letter: {
    title: "第五章：阿闻的信",
    text: `信中写道：“我在下层城看见了一切，我们的名字不是被夺走，而是被用来修补城市的裂缝。如果想取回名字，就要替雾港找到新的锚点。这个锚点是愿意留下的人。”

阿闻说他已决定留在下层城，成为锚点。他知道你会来，希望你替他把故事带回上层城。他还写下一个坐标：下层城中央的记忆之井。

你将信收好，决定去记忆之井。`,
    choices: [
      { text: "前往记忆之井。", next: "well", effects: { insight: 1 } }
    ]
  },
  vault: {
    title: "第五章：潮汐门厅",
    text: `你站在门前，将真实名字或符号纸条放入凹槽。门缓缓开启，里面是一个圆形大厅，地面刻着潮汐的轨迹。中央有一道向下的阶梯，阶梯尽头是记忆之井。

墙上刻着古老的誓言：“以名字守城，以记忆为灯。”你感到胸口发热，仿佛你的名字在回应这句誓言。你意识到这不是单纯的解谜，而是一个选择：离开或留下。

你深呼吸，走下阶梯。`,
    choices: [
      { text: "进入记忆之井。", next: "well", effects: { bravery: 1 } }
    ]
  },
  well: {
    title: "第六章：记忆之井",
    text: `记忆之井像一面竖直的湖，井壁上浮动着城市居民的片段：孩子学会第一句语言，老人把名字传给孙辈，恋人互赠昵称。你听见阿闻的声音在井底回响：“名字是潮汐的回声。”

你在井边看到阿闻，他看起来像一位疲惫的船长，眼里却有光。他告诉你，他愿意成为雾港新的锚点，但他需要你帮忙做选择：你可以替他留下，或带他离开，让雾港寻找新的锚点。

井水在脚边起伏，你感到自己的名字在心口发烫。`,
    choices: [
      { text: "替阿闻留下，成为雾港锚点。", next: "ending_anchor", effects: { trust: 2, bravery: 1 } },
      { text: "带阿闻离开，寻找新的锚点。", next: "ending_escape", effects: { bravery: 2, insight: 1 } },
      { text: "询问是否有第三条路。", next: "ending_third", effects: { insight: 2 } }
    ]
  },
  ending_anchor: {
    title: "终章：留下者",
    text: `你决定留下。阿闻看着你，缓缓点头。他将自己的名字交给你，你则把自己的名字沉入井中。雾港的钟声再次响起，这一次是正向的，像心跳。

你在下层城安顿下来，成为新的锚点。你能感到城市的呼吸与你一致，你也逐渐了解雾港为何需要名字。偶尔，你会在潮汐最低时看到远方的船，知道阿闻已经离开。

你在记忆之井旁写下新的航行日志，留给未来的旅人。你知道有一天，另一个人会读到你的故事，踏入雾港寻找自己的名字。`,
    choices: [
      { text: "重新开始旅程。", next: "prologue", effects: {} }
    ]
  },
  ending_escape: {
    title: "终章：离开者",
    text: `你握住阿闻的手，带他离开记忆之井。雾港的雾在你们身后翻涌，像一条失去锚点的船。你们回到上层城时，天已泛白。

雾港失去了短暂的平衡，但你们在码头遇见砚宁，她说她会留下成为新的锚点。你带着阿闻和他未完成的地图离开，答应把雾港的故事写成一本书。

当船离港时，你听见雾港的钟声再次响起，你的名字在心里清晰而坚定。你知道自己不再迷失。`,
    choices: [
      { text: "重新开始旅程。", next: "prologue", effects: {} }
    ]
  },
  ending_third: {
    title: "终章：第三条路",
    text: `你问是否还有第三条路。阿闻沉默片刻，说雾港真正需要的是一个故事，一个愿意留下名字、却不必留下身体的人。你忽然明白：故事可以成为锚点。

你提议将雾港的记忆写入航行日志，邀请城民共同署名。你们回到上层城，在广场上发起一次新的记名仪式，城民将名字写在日志上，而不是交给潮汐。

当最后一人签名时，雾散了一瞬，露出天空。雾港获得新的锚点，而你与阿闻一同离开，带着一本厚重的故事集。`,
    choices: [
      { text: "重新开始旅程。", next: "prologue", effects: {} }
    ]
  }
};

const state = loadState() || structuredClone(defaultState);

const titleEl = document.getElementById("story-title");
const textEl = document.getElementById("story-text");
const choicesEl = document.getElementById("choices");
const startBtn = document.getElementById("start-btn");
const loadBtn = document.getElementById("load-btn");
const restartBtn = document.getElementById("restart-btn");

startBtn.addEventListener("click", () => {
  Object.assign(state, structuredClone(defaultState));
  render();
});

loadBtn.addEventListener("click", () => {
  const saved = loadState();
  if (saved) {
    Object.assign(state, saved);
  }
  render();
});

restartBtn.addEventListener("click", () => {
  Object.assign(state, structuredClone(defaultState));
  saveState();
  render();
});

function applyEffects(effects = {}) {
  for (const [key, value] of Object.entries(effects)) {
    state.stats[key] = (state.stats[key] || 0) + value;
  }
}

function applyChoice(choice) {
  applyEffects(choice.effects);
  if (choice.addItem && !state.inventory.includes(choice.addItem)) {
    state.inventory.push(choice.addItem);
  }
  if (choice.flag) {
    state.flags[choice.flag] = true;
  }
  state.nodeId = choice.next;
  saveState();
  render();
}

function renderParagraphs(text) {
  return text
    .split("\n\n")
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function renderStats() {
  document.getElementById("stat-bravery").textContent = state.stats.bravery;
  document.getElementById("stat-insight").textContent = state.stats.insight;
  document.getElementById("stat-trust").textContent = state.stats.trust;
  document.getElementById("inventory").textContent =
    state.inventory.length > 0 ? state.inventory.join("、") : "无";
}

function render() {
  const node = story[state.nodeId];
  if (!node) return;
  titleEl.textContent = node.title;
  textEl.innerHTML = renderParagraphs(node.text);
  choicesEl.innerHTML = "";
  node.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.textContent = choice.text;
    button.addEventListener("click", () => applyChoice(choice));
    choicesEl.appendChild(button);
  });
  renderStats();
}

function saveState() {
  localStorage.setItem("mist-harbor-state", JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem("mist-harbor-state");
  return raw ? JSON.parse(raw) : null;
}

render();
