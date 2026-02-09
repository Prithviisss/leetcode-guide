console.log("Content script loaded");

const btn = document.createElement("button");
btn.innerText = "💡 AI Hint";

btn.style.position = "fixed";
btn.style.bottom = "20px";
btn.style.right = "20px";
btn.style.zIndex = "9999";
btn.style.padding = "10px 14px";
btn.style.borderRadius = "8px";
btn.style.border = "none";
btn.style.background = "#0f172a";
btn.style.color = "white";
btn.style.cursor = "pointer";

document.body.appendChild(btn);

btn.addEventListener("click", () => {
  console.log("BUTTON CLICKED");

  // Grab ONLY the problem description
  const problemElement = document.querySelector('.css-v3d350'); // LeetCode problem div
  const problemText = problemElement
    ? problemElement.innerText.slice(0, 1500) // limit to 1500 chars
    : document.body.innerText.slice(0, 1500); // fallback

  chrome.runtime.sendMessage(
    {
      type: "GET_HINT",
      problem: problemText
    },
    (res) => {
      console.log("RESPONSE:", res);
      alert(res?.hint || "No response");
    }
  );
});

