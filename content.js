console.log("LeetCode AI Hints loaded");

function showHint(text) {
  let box = document.getElementById("ai-hint-box");
  if (box) box.remove();

  box = document.createElement("div");
  box.id = "ai-hint-box";
  box.innerText = text;

  box.style.position = "fixed";
  box.style.bottom = "100px";
  box.style.right = "40px";
  box.style.zIndex = "2147483647";
  box.style.width = "300px";
  box.style.padding = "14px";
  box.style.background = "#1a1a1a";
  box.style.color = "#fff";
  box.style.borderRadius = "10px";
  box.style.fontSize = "13px";
  box.style.whiteSpace = "pre-line";
  box.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";

  document.body.appendChild(box);
}

function injectButton() {
  if (document.getElementById("ai-hint-btn")) return;

  const btn = document.createElement("button");
  btn.id = "ai-hint-btn";
  btn.innerText = "Get AI Hint";

  btn.style.position = "fixed";
  btn.style.bottom = "40px";
  btn.style.right = "40px";
  btn.style.zIndex = "2147483647";
  btn.style.padding = "14px 18px";
  btn.style.background = "#ffa116";
  btn.style.border = "none";
  btn.style.borderRadius = "10px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "700";

  btn.onclick = () => {
    const problem = document.body.innerText.slice(0, 6000);

    chrome.runtime.sendMessage(
      {
        type: "GET_HINT",
        problem
      },
      (res) => {
        showHint(res.hint);
      }
    );
  };

  document.body.appendChild(btn);
}

let tries = 0;
const interval = setInterval(() => {
  injectButton();
  tries++;
  if (tries > 20) clearInterval(interval);
}, 1000);
