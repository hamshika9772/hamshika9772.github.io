(async () => {
  const span = document.getElementById("checkversion");
  const subtitle = document.querySelector(".subtitle");

  const JSON_URL = "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/version-bloxcraft-ubg.json";

  try {
    
    const localVersion = subtitle.childNodes[0].textContent.trim();

    const res = await fetch(JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    const remoteVersion = data.version; 

    if (remoteVersion === localVersion) {
      span.textContent = "(Latest Version)";
      span.style.color = "limegreen";
    } else {
      span.textContent = "(Needs An Update)";
      span.style.color = "red";
    }

  } catch (err) {
    span.textContent = "(ERROR Fetching JSON API)";
    span.style.color = "yellow";
  }
})();
