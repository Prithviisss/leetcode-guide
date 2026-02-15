let currentHints = [];
let hintIndex = 0;

// 1. Injected Styles
const style = document.createElement('style');
style.textContent = `
  @keyframes glow {
    0% { box-shadow: 0 0 5px #ffa116; transform: scale(1); }
    50% { box-shadow: 0 0 20px #ffa116, 0 0 35px #ff7000; transform: scale(1.02); }
    100% { box-shadow: 0 0 5px #ffa116; transform: scale(1); }
  }
  .glowing-btn { animation: glow 2s infinite ease-in-out; }
  .tab-btn { flex: 1; padding: 12px; border: none; background: #2a2a2a; color: #888; cursor: pointer; font-size: 11px; font-weight: bold; border-bottom: 2px solid transparent; }
  .tab-btn.active { background: #333; color: #ffa116; border-bottom: 2px solid #ffa116; }
  #content-area::-webkit-scrollbar { width: 6px; }
  #content-area::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
`;
document.head.appendChild(style);

function createModal() {
  if (document.getElementById("ai-hint-modal")) return;
  const modal = document.createElement("div");
  modal.id = "ai-hint-modal";
  modal.style.cssText = "position:fixed; bottom:100px; right:30px; z-index:10000; width:400px; background:#1a1a1a; color:#fff; border-radius:12px; border:1px solid #333; display:none; overflow:hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6); font-family: sans-serif;";
  
  modal.innerHTML = `
    <div style="display:flex; background: #222;">
      <button class="tab-btn active" id="tab-hints">HINTS</button>
      <button class="tab-btn" id="tab-dry">DRY RUN</button>
      <button class="tab-btn" id="tab-comp">COMPLEXITY</button>
      <button id="close-modal" style="background:none; border:none; color:#555; padding:10px; cursor:pointer;">✕</button>
    </div>
    <div style="padding:20px;">
      <div id="content-area" style="max-height:280px; overflow-y:auto; line-height:1.6; font-size:14px; color:#ddd; white-space: pre-wrap; font-family: monospace;">
        Loading AI insights...
      </div>
      <div id="hint-nav" style="margin-top:15px; display:none; justify-content:space-between; align-items:center;">
        <span id="hint-lvl" style="font-size:11px; color:#ffa116; font-weight:bold;">LEVEL 1</span>
        <button id="next-hint-btn" style="background:#ffa116; color:#000; border:none; padding:8px 15px; border-radius:6px; font-weight:bold; cursor:pointer;">Next Level →</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("close-modal").onclick = () => modal.style.display = "none";
  document.getElementById("tab-hints").onclick = () => switchTab("HINTS");
  document.getElementById("tab-dry").onclick = () => switchTab("DRY_RUN");
  document.getElementById("tab-comp").onclick = () => switchTab("COMPLEXITY");
}

function switchTab(mode) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  const btnMap = {"HINTS": "tab-hints", "DRY_RUN": "tab-dry", "COMPLEXITY": "tab-comp"};
  document.getElementById(btnMap[mode]).classList.add("active");

  const contentArea = document.getElementById("content-area");
  const hintNav = document.getElementById("hint-nav");
  contentArea.innerText = "Processing...";
  hintNav.style.display = "none";

  const problem = document.querySelector('[data-track-load="description_content"]')?.innerText || document.title;
  chrome.runtime.sendMessage({ type: "GET_DATA", problem, mode }, (res) => {
    if (mode === "HINTS") {
      currentHints = Array.isArray(res.result) ? res.result : [res.result];
      hintIndex = 0;
      hintNav.style.display = "flex";
      updateHintDisplay();
    } else {
      contentArea.innerText = res.result;
    }
    contentArea.scrollTop = 0;
  });
}

function updateHintDisplay() {
  document.getElementById("content-area").innerText = currentHints[hintIndex];
  document.getElementById("hint-lvl").innerText = `LEVEL ${hintIndex + 1} OF 3`;
  document.getElementById("next-hint-btn").style.visibility = hintIndex === 2 ? "hidden" : "visible";
}

document.addEventListener('click', (e) => {
  if (e.target.id === "next-hint-btn" && hintIndex < 2) {
    hintIndex++;
    updateHintDisplay();
  }
});

function injectBtn() {
  if (document.getElementById("hint-trigger")) return;
  const btn = document.createElement("button");
  btn.id = "hint-trigger";
  btn.classList.add("glowing-btn");
  btn.innerHTML = "💡 AI Coach";
  btn.style.cssText = "position:fixed; bottom:30px; right:30px; z-index:10001; padding:15px 25px; background:#ffa116; color:#000; border:none; border-radius:50px; font-weight:bold; cursor:pointer;";
  
  btn.onclick = () => {
    btn.classList.remove("glowing-btn");
    const modal = document.getElementById("ai-hint-modal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
    if (modal.style.display === "block") switchTab("HINTS");
  };
  document.body.appendChild(btn);
}

setInterval(() => { createModal(); injectBtn(); }, 3000);

