const GEMINI_API_KEY = "AIzaSyCoP4u_gkZeiJ_uCMq3PrgHZ4WPzLm1qg0";

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_HINT") {
    fetchHint(req.problem)
      .then(hints => sendResponse({ hints }))
      .catch(err => sendResponse({ hints: ["Error: " + err.message] }));
    return true; 
  }
});

async function fetchHint(problemText) {
  // 2026 Stable Path: v1 endpoint + gemini-2.5-flash
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ 
          text: `Problem: ${problemText.substring(0, 1500)}\n\nAct as a DSA coach. Provide 3 short, progressive hints. Output ONLY a valid JSON array of strings. Example: ["Hint 1", "Hint 2", "Hint 3"]` 
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      // Keep safety relaxed for technical terms
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    })
  });

  const data = await response.json();

  if (data.error) {
    // If 2.5 isn't active for your specific key yet, try the absolute latest 3-flash
    if (data.error.code === 404) return fetchLatestGemini3(problemText);
    throw new Error(data.error.message);
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  try {
    const jsonMatch = rawText.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [rawText];
  } catch (e) {
    return [rawText];
  }
}

// Emergency Fallback for newest Gemini 3 accounts
async function fetchLatestGemini3(problemText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Provide 3 DSA hints in a JSON array for: ${problemText.substring(0, 1000)}` }] }]
    })
  });
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const match = text.match(/\[.*\]/s);
  return match ? JSON.parse(match[0]) : [text];
}



