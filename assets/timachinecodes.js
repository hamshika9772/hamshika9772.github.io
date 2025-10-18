  const secretwords = ["fakeuser", "notexter", "frwendsec"]
  const wordlist =  ["fekeusa", "nttss", "okay"]
  const w0ord = ["bloxcraft-wins-offi", "bloxyubg", "goldenmonmn", "cookenmone"];
  const word = ["Some", "BetaSigma", "School"]
  
  const urlparma = "code-378297"
  const openPopup = document.getElementById("openPopup");
  const popupOverlay = document.getElementById("popupOverlay");
  const closePopup = document.getElementById("closePopup");
  const submitCode = document.getElementById("submitCode");
  const secretInput = document.getElementById("secretInput");
  const message = document.getElementById("message");

  openPopup.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
    secretInput.focus();
  });

  closePopup.addEventListener("click", () => {
    popupOverlay.style.display = "none";
    message.textContent = "";
    secretInput.value = "";
  });

  submitCode.addEventListener("click", () => {
    const code = secretInput.value.trim();
    if (w0ord.includes(code)) {
      
      window.location.href = `/apps/secret-code/${urlparma}`;
    } else {
     
      message.textContent = "❌ Wrong! Try Again!";
    }
  });

  
  secretInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitCode.click();
  });
