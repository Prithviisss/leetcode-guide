let currentHints = [];
let hintIndex = 0;

function createModal() {
  if (document.getElementById("ai-hint-modal")) return;

  const modal = document.createElement("div");
  modal.id = "ai-hint-modal";
  modal.style.cssText = `
    position: fixed; bottom: 100px; right: 30px; z-index: 10000;
    width: 380px; min-height: 220px; padding: 25px; background: #1a1a1a; color: #fff;
    border-radius: 16px; box-shadow: 0 15px 50px rgba(0,0,0,0.8);
    font-family: 'Inter', sans-serif; display: none; border: 1px solid #333;
  `;

  modal.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="background:#ffa116; color:#000; padding:2px 8px; border-radius:4px; font-weight:900; font-size:12px;">PRO</span>
        <span style="font-weight:bold; font-size:14px; color:#eee;">AI COACH</span>
      </div>
      <button id="close-hint" style="background:none; border:none; color:#555; cursor:pointer; font-size:22px;">✕</button>
    </div>
    
    <div id="hint-body" style="background:#242424; padding:20px; border-radius:12px; border-left:4px solid #ffa116; margin-bottom:20px;">
      <div id="lvl-tag" style="color:#ffa116; font-size:11px; font-weight:bold; margin-bottom:10px; text-transform:uppercase;">Level 1: Subtle</div>
      <p id="hint-text" style="line-height:1.6; font-size:15px; margin:0; color:#ddd;"></p>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div id="dot-container" style="display:flex; gap:6px;">
        <div class="h-dot" style="width:8px; height:8px; border-radius:50%; background:#ffa116;"></div>
        <div class="h-dot" style="width:8px; height:8px; border-radius:50%; background:#333;"></div>
        <div class="h-dot" style="width:8px; height:8px; border-radius:50%; background:#333;"></div>
      </div>
      <div style="display:flex; gap:10px;">
        <button id="prev-btn" style="background:#333; color:#fff; border:none; padding:8px 15px; border-radius:8px; cursor:pointer; font-size:13px;">Back</button>
        <button id="next-btn" style="background:#ffa116; color:#000; border:none; padding:8px 15px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">Next Level</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("close-hint").onclick = () => modal.style.display = "none";
  
  document.getElementById("prev-btn").onclick = () => { if(hintIndex > 0) { hintIndex--; updateUI(); } };
  document.getElementById("next-btn").onclick = () => { if(hintIndex < currentHints.length - 1) { hintIndex++; updateUI(); } };
}

function updateUI() {
  const levels = ["Level 1: Subtle Clue", "Level 2: Approach Suggestion", "Level 3: Logic Breakdown"];
  document.getElementById("hint-text").innerText = currentHints[hintIndex];
  document.getElementById("lvl-tag").innerText = levels[hintIndex];
  
  const dots = document.querySelectorAll(".h-dot");
  dots.forEach((d, i) => d.style.background = i <= hintIndex ? "#ffa116" : "#333");

  const nextBtn = document.getElementById("next-btn");
  if(hintIndex === currentHints.length - 1) {
    nextBtn.innerText = "Got it!";
    nextBtn.style.background = "#444";
    nextBtn.style.color = "#aaa";
  } else {
    nextBtn.innerText = "Next Level";
    nextBtn.style.background = "#ffa116";
    nextBtn.style.color = "#000";
  }
}

// Keep the trigger button injection
function injectBtn() {
  if (document.getElementById("hint-trigger")) return;
  const b = document.createElement("button");
  b.id = "hint-trigger";
  b.innerHTML = "<span>💡</span> Get Hints";
  b.style.cssText = "position:fixed; bottom:30px; right:30px; z-index:10001; padding:12px 24px; background:#ffa116; color:#000; border:none; border-radius:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); transition: transform 0.2s;";
  
  b.onclick = () => {
    const m = document.getElementById("ai-hint-modal");
    if(m.style.display === "block") { m.style.display = "none"; return; }
    b.innerText = "⌛...";
    const prob = document.querySelector('[data-track-load="description_content"]')?.innerText || document.title;
    chrome.runtime.sendMessage({type:"GET_HINT", problem: prob}, (res) => {
      b.innerHTML = "<span>💡</span> Get Hints";
      if(res?.hints?.length >= 3) {
        currentHints = res.hints;
        hintIndex = 0;
        m.style.display = "block";
        updateUI();
      }
    });
  };
  document.body.appendChild(b);
}

setInterval(() => { createModal(); injectBtn(); }, 3000);

