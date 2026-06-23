const iframe = document.getElementById("contentFrame");
const htmlContainer = document.getElementById("htmlContainer");
const home = document.getElementById("home");
const extraOverlay = document.getElementById("extraOverlay");
const extraNavGroup = document.getElementById("extraNavGroup");

const EXTRA_NAVS_STORAGE_KEY = "extraNavs";
const WISP_STORAGE_KEY = "proxy-ws";
const IDLE_STORAGE_KEY = "BloxcraftSecretUBGFaviconInjection";

const IDLE_PRESETS = {
  none: { type: "none", label: "None" },
  classroom: {
    type: "preset",
    preset: "classroom",
    label: "Google Classroom",
    title: "Home - Classroom",
    favicon: "/idle-favicons/classroom.ico"
  },
  docs: {
    type: "preset",
    preset: "docs",
    label: "Google Docs",
    title: "Google Docs",
    favicon: "/idle-favicons/docs.ico"
  },
  drive: {
    type: "preset",
    preset: "drive",
    label: "Google Drive",
    title: "Home - Google Drive",
    favicon: "/idle-favicons/drive.png"
  }
};

let extraNavs = JSON.parse(localStorage.getItem(EXTRA_NAVS_STORAGE_KEY) || "[]");

const originalTitle = document.title;
const originalFaviconHref = (() => {
  const el = document.querySelector("link[rel~='icon'], link[rel='shortcut icon']");
  return el ? el.href : "/favicon.ico";
})();

let idleConfig = loadIdleConfig();

function loadIdleConfig() {
  try {
    const raw = localStorage.getItem(IDLE_STORAGE_KEY);
    if (!raw) return { ...IDLE_PRESETS.none };
    const parsed = JSON.parse(raw);
    if (!parsed) return { ...IDLE_PRESETS.none };
    if (parsed.type === "preset" && IDLE_PRESETS[parsed.preset]) return { ...IDLE_PRESETS[parsed.preset] };
    if (parsed.type === "custom") return parsed;
    return { ...IDLE_PRESETS.none };
  } catch {
    return { ...IDLE_PRESETS.none };
  }
}

function saveIdleConfig(cfg) {
  idleConfig = cfg;
  localStorage.setItem(IDLE_STORAGE_KEY, JSON.stringify(cfg));
}

function getFaviconEl() {
  let icon = document.querySelector("link[rel~='icon']");
  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    document.head.appendChild(icon);
  }
  return icon;
}

function applyOriginalTab() {
  document.title = originalTitle;
  getFaviconEl().href = originalFaviconHref;
}

function applyIdleTab() {
  if (!idleConfig || idleConfig.type === "none") return applyOriginalTab();
  if (idleConfig.type === "preset") {
    const p = IDLE_PRESETS[idleConfig.preset];
    if (!p) return applyOriginalTab();
    document.title = p.title;
    getFaviconEl().href = p.favicon;
    return;
  }
  if (idleConfig.type === "custom") {
    document.title = idleConfig.title || originalTitle;
    getFaviconEl().href = idleConfig.favicon || originalFaviconHref;
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) applyIdleTab();
  else applyOriginalTab();
});

function clearContent() {
  iframe.style.display = "none";
  iframe.src = "";
  htmlContainer.style.display = "none";
  htmlContainer.innerHTML = "";
}

function showHome() {
  clearContent();
  home.style.display = "flex";
}

function loadPage(url) {
  home.style.display = "none";
  clearContent();
  iframe.style.display = "block";
  iframe.src = url;
}

function toggleExtraOverlay() {
  const el = extraOverlay;
  if (!el) return;
  if (el.style.display === "flex") {
    el.style.display = "none";
  } else {
    el.style.display = "flex";
  }
}

function renderExtraNavGroup() {
  extraNavGroup.innerHTML = "";
  extraNavs.forEach(e => {
    const b = document.createElement("button");
    b.className = "nav-btn";
    b.innerHTML = e.svg;
    b.onclick = () => loadPage(e.link);
    extraNavGroup.appendChild(b);
  });
}

function renderExtraOverlay() {
  const c = document.getElementById("extraList");
  if (!c) return;
  c.innerHTML = "";
  predefinedExtras.forEach(item => {
    const d = document.createElement("div");
    d.innerHTML = `<span>${item.name}</span>`;
    const exists = extraNavs.find(x => x.name === item.name);
    const btn = document.createElement("button");
    btn.textContent = exists ? "Remove" : "Add";
    btn.onclick = () => {
      if (exists) {
        extraNavs = extraNavs.filter(x => x.name !== item.name);
      } else {
        extraNavs.push(item);
      }
      localStorage.setItem(EXTRA_NAVS_STORAGE_KEY, JSON.stringify(extraNavs));
      renderExtraNavGroup();
      renderExtraOverlay();
    };
    d.appendChild(btn);
    c.appendChild(d);
  });
}

function exportSiteSave() {
  const data = {
    localStorage: Object.fromEntries(Object.entries(localStorage)),
    cookies: document.cookie
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "save.json";
  a.click();
}

function importSiteSave(input) {
  const file = input.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    const data = JSON.parse(r.result);
    Object.entries(data.localStorage || {}).forEach(([k, v]) => localStorage.setItem(k, v));
    location.reload();
  };
  r.readAsText(file);
}

function validateFaviconUrl(url) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });
}

function toggleSettingsOverlay() {
  const el = document.getElementById("settingsOverlay");
  if (!el) return;
  const open = el.style.display === "flex";
  el.style.display = open ? "none" : "flex";
  if (!open) renderSettingsPanel();
}

function renderSettingsPanel() {
  const body = document.getElementById("settingsBody");
  if (!body) return;

  body.innerHTML = `
  <div>
    <h3>Idle Tab</h3>
    <select id="idleSelect">
      <option value="none">None</option>
      <option value="classroom">Classroom</option>
      <option value="docs">Docs</option>
      <option value="drive">Drive</option>
      <option value="custom">Custom</option>
    </select>

    <input id="idleTitle" placeholder="title">
    <input id="idleIcon" placeholder="favicon">

    <button id="saveIdle">Save</button>
  </div>
  `;

  document.getElementById("saveIdle").onclick = async () => {
    const v = document.getElementById("idleSelect").value;
    if (v === "none") return saveIdleConfig({ type: "none" });
    if (v === "custom") {
      const t = document.getElementById("idleTitle").value;
      const f = document.getElementById("idleIcon").value;
      try {
        await validateFaviconUrl(f);
        saveIdleConfig({ type: "custom", title: t, favicon: f });
      } catch {
        alert("bad icon");
      }
      return;
    }
    saveIdleConfig({ ...IDLE_PRESETS[v] });
  };
}

renderExtraNavGroup();
renderExtraOverlay();

window.showHome = showHome;
window.loadPage = loadPage;
window.toggleSettingsOverlay = toggleSettingsOverlay;
window.toggleExtraOverlay = toggleExtraOverlay;
window.exportSiteSave = exportSiteSave;
window.importSiteSave = importSiteSave;
