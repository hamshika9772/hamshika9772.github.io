const grid = document.getElementById("grid");
const search = document.getElementById("search");
const count = document.getElementById("count");

const PAGE_SIZE = 60;

let DATA = {
  blox: [],
  gn: [],
  elite: [],
  sea: [],
  ugs: [],
  seraph: [],
  ckv: [],
  hydra: [],
  ccported: [],
  googleclass: [],
  truffled: [],
  nowgg: []
};

let CURRENT = [];
let FILTERED = [];

let RENDERED = 0;
let OBSERVER_SENTINEL = null;
let OBSERVER = null;

function safeArray(v){
  return Array.isArray(v) ? v : [];
}

async function loadBlox(){
  if(DATA.blox.length) return;

  try{
    const r = await fetch("/games/games.json");
    const d = await r.json();

    DATA.blox = safeArray(d);
  }catch(e){
    console.error("Blox failed:", e);
    DATA.blox = [];
  }
}

async function loadGN(){
  if(DATA.gn.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/freebuisness/assets/zones.json");
    const d = await r.json();

    DATA.gn = safeArray(d)
      .filter(g => g.id !== -1 && !(g.name || "").startsWith("[!]"))
      .map(g => ({
        name: g.name || "Unknown",
        img: "https://cdn.jsdelivr.net/gh/freebuisness/covers@main/" + (g.cover || "").replace("{COVER_URL}", ""),
        url: "/app-viewer/gn-math/?gn-id=" + g.id
      }));
  }catch(e){
    console.error("GN failed:", e);
    DATA.gn = [];
  }
}

async function loadElite(){
  if(DATA.elite.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/elite-gamez/elite-gamez.github.io@main/games.json");
    const d = await r.json();

    DATA.elite = safeArray(d).map(g => ({
      name: g.title || "Unknown",
      img: "https://cdn.jsdelivr.net/gh/elite-gamez/elite-gamez.github.io@main/" + g.image,
      url: "/app-viewer/elite-gamez?url=" + encodeURIComponent(g.url)
    }));
  }catch(e){
    console.error("Elite failed:", e);
    DATA.elite = [];
  }
}

async function loadSea(){
  if(DATA.sea.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/sea-bean-unblocked/sde@main/zzz.json");
    const d = await r.json();

    DATA.sea = safeArray(d).map(g => {
      const cover = (g.cover || "").replace("{COVER_URL}/", "");

      return {
        name: g.name || "Unknown",
        img: cover.startsWith("http")
          ? cover
          : "https://cdn.jsdelivr.net/gh/sea-bean-unblocked/Singlemile@main/Icon/" + cover,
        url: "/app-viewer/sea-bean?view=" + encodeURIComponent(g.id)
      };
    });
  }catch(e){
    console.error("Sea failed:", e);
    DATA.sea = [];
  }
}

async function loadUGS(){
  if(DATA.ugs.length) return;

  const repos = [
    "tharun9772/ugs-1",
    "tharun9772/ugs-2",
    "tharun9772/ugs-3"
  ];

  let games = [];

  for(const repo of repos){
    try{
      const r = await fetch(`https://cdn.jsdelivr.net/gh/tharun9772/game-assets/api_generated/github/${repo}/file.json`);
      const d = await r.json();

      safeArray(d).forEach(f => {
        if(f.type === "file" && f.name.startsWith("cl") && f.name.endsWith(".html")){
          games.push({
            name: f.name.replace(/^cl/, "").replace(".html", ""),
            img: "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/5968517.png",
            url: "/app-viewer/ugs-files?view=" + encodeURIComponent(f.name)
          });
        }
      });

    }catch(e){
      console.warn("UGS failed:", repo, e);
    }
  }

  DATA.ugs = games;
}

async function loadSeraph(){
  if(DATA.seraph.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/DominumNetwork/dominum@main/src/assets/libraries/seraph/games.json");
    const d = await r.json();

    const BASE = "https://cdn.jsdelivr.net/gh/a456pur/seraph@main/games/";

    DATA.seraph = safeArray(d).map(g => ({
      name: g.name || "Unknown",
      img: g.img || "",
      url: "/app-viewer/seraph/?view=" + (g.url ? g.url.replace(BASE, "") : "")
    }));

  }catch(e){
    console.error("Seraph failed:", e);
    DATA.seraph = [];
  }
}

async function loadCKV(){
  if(DATA.ckv.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/carbonicality/ChickenKingsVault@main/games.json");
    const d = await r.json();

    DATA.ckv = safeArray(d).map(g => ({
      name: g.name || "Unknown",
      img: g.img
        ? "https://cdn.jsdelivr.net/gh/carbonicality/ChickenKingsVault@main/images/" + g.img
        : "",
      url: "/app-viewer/chicken-kings-vault/?view=" + g.html
    }));

  }catch(e){
    console.error("CKV failed:", e);
    DATA.ckv = [];
  }
}

async function loadHydra(){
  if(DATA.hydra.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/Hydra-Network/hydra-assets@main/gmes.json");
    const d = await r.json();

    DATA.hydra = safeArray(d).map(g => ({
      name: g.title || "Unknown",
      img: g.thumb
        ? "https://cdn.jsdelivr.net/gh/Hydra-Network/hydra-assets@main/" + g.thumb
        : "",
      url: "/app-viewer/hydra-network/?view=" + g.file_name
    }));

  }catch(e){
    console.error("Hydra failed:", e);
    DATA.hydra = [];
  }
}

async function loadCCPorted(){
  if(DATA.ccported.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/ccported-stupid-game-lib.json");
    const d = await r.json();

    DATA.ccported = safeArray(d).map(g => {
      if(!g.base || !g.Id) return null;

      return {
        name: (g.name && g.name.trim()) ? g.name : "Game " + g.Id,
        img: g.base + "/thumb.jpg",
        url: "/app-viewer/ccported/?view=" + g.Id
      };
    }).filter(Boolean);

  }catch(e){
    console.error("CCPorted failed:", e);
    DATA.ccported = [];
  }
}

async function loadGoogleClass(){
  if(DATA.googleclass.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/bloxcraft-st/google-class-files@main/assets/games.json");
    const d = await r.json();

    DATA.googleclass = safeArray(d).map(g => ({
      name: g.name || "Unknown",
      img: g.img || "",
      url: "/app-viewer/google-class/?view=" + encodeURIComponent(g.url)
    }));

  }catch(e){
    console.error("GoogleClass failed:", e);
    DATA.googleclass = [];
  }
}

async function loadTruffled(){
  if(DATA.truffled.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/aukak/truffled@main/public/js/json/g.json");
    const d = await r.json();

    DATA.truffled = Object.values(d || {}).map(g => {

      const thumb = (g.thumbnail || "")
        .replace(/^\/+/, "")
        .replace(/^png\/games\//, "");

      return {
        name: g.name || "Unknown",

        img: thumb
          ? "https://cdn.jsdelivr.net/gh/aukak/truffled@main/public/png/games/" + thumb
          : "/1f3ae.png",

        url: g.url
          ? "/sail/embed/#https://truffled.lol/" + g.url.replace(/^\/+/, "")
          : ""
      };
    }).filter(g => g.url);

  }catch(e){
    console.error("Truffled failed:", e);
    DATA.truffled = [];
  }
}

async function loadNowGG(){
  if(DATA.nowgg.length) return;

  try{
    const r = await fetch("https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/nowgg.fun/games.json");
    const d = await r.json();

    DATA.nowgg = Object.values(d || {}).map(g => ({
      name: g.name || "Unknown",

      img: g.img
        ? "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/nowgg.fun/" + g.img.replace(/^\/+/, "")
        : "/1f3ae.png",

      url: g.url
        ? "/sail/embed/#" + g.url
        : ""
    })).filter(g => g.url);

  }catch(e){
    console.error("NowGG failed:", e);
    DATA.nowgg = [];
  }
}

document.querySelectorAll(".cat").forEach(btn => {
  btn.onclick = async () => {

    document.querySelectorAll(".cat").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");

    const cat = btn.dataset.cat;

    try{

      if(cat === "blox") await loadBlox();
      if(cat === "gn") await loadGN();
      if(cat === "elite") await loadElite();
      if(cat === "sea") await loadSea();
      if(cat === "ugs") await loadUGS();
      if(cat === "seraph") await loadSeraph();
      if(cat === "ckv") await loadCKV();
      if(cat === "hydra") await loadHydra();
      if(cat === "ccported") await loadCCPorted();
      if(cat === "googleclass") await loadGoogleClass();
      if(cat === "truffled") await loadTruffled();
      if(cat === "nowgg") await loadNowGG();

      if(cat === "all"){
        await Promise.all([
          loadBlox(),
          loadGN(),
          loadElite(),
          loadSea(),
          loadUGS(),
          loadSeraph(),
          loadCKV(),
          loadHydra(),
          loadCCPorted(),
          loadGoogleClass(),
          loadTruffled(),
          loadNowGG()
        ]);

        CURRENT = Object.values(DATA).flat().filter(Boolean);

      }else{
        CURRENT = DATA[cat] || [];
      }

      FILTERED = CURRENT;

      RESET_RENDER();
      updateCount();
      render(true);

    }catch(e){
      console.error("Category failed:", cat, e);
    }
  };
});

search.oninput = () => {
  const v = search.value.toLowerCase();

  FILTERED = CURRENT.filter(g =>
    g &&
    g.name &&
    g.name.toLowerCase().includes(v)
  );

  RESET_RENDER();
  updateCount();
  render(true);
};

function render(reset = false){
  const fallback = "/1f3ae.png";

  if(reset){
    grid.innerHTML = "";
    RENDERED = 0;
  }

  const validGames = FILTERED.filter(g =>
    g &&
    g.name &&
    g.url
  );

  const slice = validGames.slice(RENDERED, RENDERED + PAGE_SIZE);

  const frag = document.createDocumentFragment();

  for(const g of slice){

    const card = document.createElement("div");
    card.className = "game-card";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.src = g.img || fallback;
    img.onerror = () => {
      img.onerror = null;
      img.src = fallback;
    };

    const title = document.createElement("h3");
    title.textContent = g.name;

    const link = document.createElement("a");
    link.className = "play-btn";
    link.href = g.url;
    link.textContent = "Play";

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(link);

    frag.appendChild(card);
  }

  grid.appendChild(frag);

  RENDERED += slice.length;

  if(RENDERED < validGames.length){
    setupObserver();
  }
}

function setupObserver(){

  if(OBSERVER_SENTINEL) return;

  OBSERVER_SENTINEL = document.createElement("div");
  OBSERVER_SENTINEL.id = "sentinel";

  grid.appendChild(OBSERVER_SENTINEL);

  if(OBSERVER){
    OBSERVER.disconnect();
  }

  OBSERVER = new IntersectionObserver(entries => {

    if(entries[0].isIntersecting){

      if(OBSERVER_SENTINEL){
        OBSERVER_SENTINEL.remove();
        OBSERVER_SENTINEL = null;
      }

      render(false);
    }

  }, {
    rootMargin: "300px"
  });

  OBSERVER.observe(OBSERVER_SENTINEL);
}

function RESET_RENDER(){
  RENDERED = 0;

  if(OBSERVER){
    OBSERVER.disconnect();
    OBSERVER = null;
  }

  if(OBSERVER_SENTINEL){
    OBSERVER_SENTINEL.remove();
    OBSERVER_SENTINEL = null;
  }
}

function updateCount(){
  count.textContent = FILTERED.length + " games";
}

(async () => {

  await loadBlox();

  CURRENT = DATA.blox;
  FILTERED = CURRENT;

  updateCount();
  render(true);

})();
