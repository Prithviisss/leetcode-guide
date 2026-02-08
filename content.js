console.log("LeetCode AI Hints extension loaded");

function waitForPage() {
  const titleEl = document.querySelector('[data-cy="question-title"]');
  const descEl = document.querySelector('[data-track-load="description_content"]');

  if (!titleEl || !descEl) {
    setTimeout(waitForPage, 500);
    return;
  }

  addHintButton(titleEl, descEl);
}

function addHintButton(titleEl, descEl) {
  if (document.getElementById("ai-hint-btn")) return;

  const btn = document.createElement("button");
  btn.id = "ai-hint-btn";
  btn.textContent = "Get AI Hint";

  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.zIndex = "10000";
  btn.style.padding = "12px 16px";
  btn.style.background = "#ffa116";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "600";

  btn.onclick = () => {
    const problemTitle = titleEl.innerText.trim();
    const problemDescription = descEl.innerText.trim();

    console.log("📘 TITLE:", problemTitle);
    console.log("📄 DESCRIPTION:", problemDescription);
  };

  document.body.appendChild(btn);
}

waitForPage();

