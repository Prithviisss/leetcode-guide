import { GEMINI_API_KEY } from "./config.js";


chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_DATA") {
    fetchFromAI(req.problem, req.mode)
      .then(data => sendResponse({ result: data }))
      .catch(err => sendResponse({ result: "Error: " + err.message }));
    return true; 
  }
});

async function fetchFromAI(problemText, mode) {
  // Using v1 stable endpoint for 2026 compatibility
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  
  let promptText = "";
  if (mode === "HINTS") {
    promptText = `Problem: ${problemText.substring(0, 1000)}\n\nProvide exactly 3 progressive hints as a JSON array of strings.`;
  } else if (mode === "DRY_RUN") {
    promptText = `Problem: ${problemText.substring(0, 1000)}\n\nProvide a very short Dry Run table for a small example.`;
  } else if (mode === "COMPLEXITY") {
    promptText = `Problem: ${problemText.substring(0, 1000)}\n\nState Time and Space complexity in Big O notation with a 1-sentence reason.`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (mode === "HINTS") {
    try {
      const match = rawText.match(/\[[\s\S]*\]/);
      let parsed = match ? JSON.parse(match[0]) : [rawText];
      while(parsed.length < 3) parsed.push("Think about edge cases.");
      return parsed.slice(0, 3);
    } catch (e) {
      return ["Consider the input size.", "Try a brute force approach first.", "Can you optimize with a Map?"];
    }
  }
  return rawText;
}

