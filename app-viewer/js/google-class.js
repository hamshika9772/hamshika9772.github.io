const params = new URLSearchParams(location.search);
const view = params.get("view");

const viewerFrame = document.getElementById("viewerFrame");
const viewerTitle = document.getElementById("viewerTitle");

const BASE = "https://cdn.jsdelivr.net/gh/bloxcraft-st/google-class-files@main/";

let gameData = null;
let finalUrl = null;

async function loadGame(){

  if(!view){
    viewerTitle.textContent = "No game selected";
    return;
  }

  try{
    const res = await fetch(BASE + "assets/games.json");
    const data = await res.json();

    gameData = data.find(g => g.url === view);

    if(!gameData){
      viewerTitle.textContent = "Game not found";
      return;
    }

    finalUrl = BASE + gameData.url;

    viewerTitle.textContent = gameData.name;

    const html = await fetch(finalUrl).then(r => r.text());

    injectIntoFrame(html);

  } catch(err){
    console.error(err);
    viewerTitle.textContent = "Failed to load";
  }
}

function injectIntoFrame(html){

  const doc = `
  <!DOCTYPE html>
  <html>
    <head>
      <base href="${BASE}">
      <style>
        html,body {
          margin:0;
          padding:0;
          width:100%;
          height:100%;
          overflow:hidden;
          background:black;
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
  </html>
  `;

  viewerFrame.srcdoc = doc;
}


document.getElementById("openNewTab").onclick = () => {
  if(!finalUrl) return;

  window.open(finalUrl, "_blank");
};


document.getElementById("closeViewer").onclick = () => {
  location.href = "https://google.com/";
};

loadGame();
