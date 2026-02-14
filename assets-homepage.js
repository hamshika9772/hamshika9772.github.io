document.addEventListener("DOMContentLoaded", async () => {
  const span = document.getElementById("checkversion");
  const JSON_URL = "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/version-bloxcraft-ubg.json";

  try {
    if (!span) throw new Error();

    const versionLine = span.parentElement;

    const clone = versionLine.cloneNode(true);
    clone.querySelector("#checkversion")?.remove();

    const localVersion = clone.textContent.trim();

    const res = await fetch(JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error();

    const data = await res.json();
    const remoteVersion = String(data.version).trim();

    const normalize = v =>
      v.toLowerCase().replace(/\s+/g, "").replace(/^v\.?/, "");

    if (normalize(localVersion) === normalize(remoteVersion)) {
      span.textContent = "(Latest Version)";
      span.style.color = "limegreen";
    } else {
      span.textContent = "(Needs An Update)";
      span.style.color = "red";
    }

  } catch {
    span.textContent = "(ERROR Fetching JSON API)";
    span.style.color = "yellow";
  }
});

})();
