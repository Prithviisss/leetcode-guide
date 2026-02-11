let currentHints = [];
let hintIndex = 0;

function createModal() {
  if (document.getElementById("ai-hint-modal")) return;

  const modal = document.createElement("div");
  modal.id = "ai-hint-modal";
  modal.style.cssText = `
    position: fixed; bottom: 85px; right: 30px; z-index: 10000;
    width: 320px; padding: 20px; background: #262626; color: #eff1f6;
    border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    font-family: 'Inter', sans-serif; display: none; border: 1px solid #444;
  `;

  modal.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="color:#ffa116; font-weight:bold; font-size:16px;">💡 AI Coach</span>
      <button id="close-hint" style="background:none; border:none; color:#999; cursor:pointer; font-size:18px;">✕</button>
    </div>
    <div id="hint-content-box" style="background:#333; padding:12px; border-radius:8px; margin-bottom:15px;">
      <p id="hint-text" style="line-height:1.6; font-size:14px; margin:0;"></p>
    </div>
    <button id="next-hint-btn" style="width:100%; padding:10px; border-radius:8px; border:none; background:#ffa116; color:black; font-weight:bold; cursor:pointer; transition:0.2s;">
      Next Hint
    </button>
  `;

  document.body.appendChild(modal);
  document.getElementById("close-hint").onclick = () => modal.style.display = "none";
  
  document.getElementById("next-hint-btn").onclick = () => {
    if (hintIndex < currentHints.length - 1) {
      hintIndex++;
      updateHintUI();
    } else {
      const btn = document.getElementById("next-hint-btn");
      btn.innerText = "All hints shown!";
      btn.style.background = "#555";
      btn.disabled = true;
    }
  };
}

function updateHintUI() {
  const textEl = document.getElementById("hint-text");
  const btnEl = document.getElementById("next-hint-btn");
  
  textEl.innerText = currentHints[hintIndex].replace(/^\s+|\s+$/g, '');
  btnEl.innerText = `View Next Hint (${hintIndex + 1}/${currentHints.length})`;
}

function injectMainButton() {
  if (document.getElementById("ai-hint-trigger")) return;

  const btn = document.createElement("button");
  btn.id = "ai-hint-trigger";
  btn.innerText = "💡 AI Hint";
  btn.style.cssText = `
    position: fixed; bottom: 30px; right: 30px; z-index: 10001;
    padding: 12px 24px; background: #ffa116; color: black;
    border: none; border-radius: 50px; font-weight: bold; cursor: pointer;
    box-shadow: 0 4px 15px rgba(255,161,22,0.3);
  `;

  btn.onclick = () => {
    const modal = document.getElementById("ai-hint-modal");
    if (modal.style.display === "block") {
      modal.style.display = "none";
      return;
    }

    btn.innerText = "⌛...";
    const description = document.querySelector('[data-track-load="description_content"]')?.innerText || document.title;

    chrome.runtime.sendMessage({ type: "GET_HINT", problem: description }, (res) => {
      btn.innerText = "💡 AI Hint";
      if (res && res.hints && res.hints.length > 0) {
        currentHints = res.hints;
        hintIndex = 0;
        modal.style.display = "block";
        updateHintUI();
        // Reset button state in case it was disabled previously
        const nextBtn = document.getElementById("next-hint-btn");
        nextBtn.disabled = false;
        nextBtn.style.background = "#ffa116";
      } else {
        alert("AI had trouble thinking. Try again!");
      }
    });
  };

  document.body.appendChild(btn);
}

// Ensure elements stay present even if LeetCode navigates
setInterval(() => {
  createModal();
  injectMainButton();
}, 2000);

createModal();
injectMainButton();

