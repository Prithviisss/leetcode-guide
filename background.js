const GEMINI_API_KEY = "AIzaSyCoP4u_gkZeiJ_uCMq3PrgHZ4WPzLm1qg0";

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_HINT") {
    getValidModelAndHint(req.problem)
      .then(hint => sendResponse({ hint }))
      .catch(err => sendResponse({ hint: "Error: " + err.message }));
    return true;
  }
});

async function getValidModelAndHint(problemText) {
  try {
    // STEP 1: Ask Google which models this key can actually use
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();

    if (!listData.models) {
      throw new Error("Could not list models. Check if API Key is correct.");
    }

    // STEP 2: Find the best available model (Flash 1.5, then Pro, then Flash 1.0)
    const modelList = listData.models.map(m => m.name);
    const preferredModels = [
      "models/gemini-1.5-flash",
      "models/gemini-1.5-pro",
      "models/gemini-pro"
    ];

    let selectedModel = preferredModels.find(m => modelList.includes(m)) || modelList[0];

    // STEP 3: Make the actual hint request with the model we found
    const hintUrl = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(hintUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Give a short DSA hint for: " + problemText }] }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No hint found.";

  } catch (e) {
    throw e;
  }
}




