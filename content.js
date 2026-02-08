console.log("LeetCode AI Hints extension loaded");

function addHintButton() {
  if (document.getElementById("ai-hint-btn")) return;

  const btn = document.createElement("button");
  btn.id = "ai-hint-btn";
  btn.innerText = "Get AI Hint";

  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "12px 16px";
  btn.style.background = "#ffa116";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "600";

  btn.onclick = () => {
    alert("Hint button clicked! 🎯");
  };

  document.body.appendChild(btn);
}

addHintButton();
