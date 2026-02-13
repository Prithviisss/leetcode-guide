const GEMINI_API_KEY = "AIzaSyBoFuVsr7jG1ybZnKapUu_9OEVBnGFtkdY";



chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_HINT") {
    fetchHint(req.problem)
      .then(hints => sendResponse({ hints }))
      .catch(err => sendResponse({ hints: ["Error: " + err.message, "", ""] }));
    return true; 
  }
});

async function fetchHint(problemText) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ 
          text: `Problem: ${problemText.substring(0, 1000)}\n\nAct as a DSA coach. You MUST provide exactly 3 progressive hints as a JSON array of strings. 
          Format: ["Level 1 hint", "Level 2 hint", "Level 3 hint"]
          - Level 1: Very subtle clue.
          - Level 2: Algorithm or approach suggestion.
          - Level 3: Near-solution logic (but no code).` 
        }]
      }]
    })
  });

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
  try {
    // 1. Try to find a JSON array []
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length >= 3) return parsed.slice(0, 3);
      if (Array.isArray(parsed) && parsed.length > 0) return [...parsed, "Try thinking about space complexity.", "Look at constraints."];
    }
    
    // 2. Fallback: If AI just gave one string, we split it by common markers
    const fallbackHints = rawText.split(/[.!?]\s/).filter(s => s.length > 10);
    if (fallbackHints.length >= 3) return fallbackHints.slice(0, 3);

    return [rawText, "Think about the data structures involved.", "Can you optimize this with a Map or Set?"];
  } catch (e) {
    return ["Look at the input constraints.", "Try a brute force approach first.", "Can you use a Hash Map?"];
  }
}


