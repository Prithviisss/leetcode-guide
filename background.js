const GEMINI_API_KEY = "AIzaSyB3huSKSuOhp3TbLN0B0OS1elOvUYSfNls";





console.log("Background loaded");

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log("Message received:", req);

  if (req.type === "GET_HINT") {
    generateHint(req.problem)
      .then(hint => sendResponse({ hint }))
      .catch(err => {
        console.error("AI ERROR FULL:", err);
        sendResponse({ hint: "AI failed" });
      });

    return true; // MUST return true for async response
  }
});

async function generateHint(problemText) {
  const prompt = `
You are an expert DSA tutor.
Read the problem below and provide a concise, helpful hint.
Do NOT provide full solution or code.

Problem:
${problemText}
`;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "prompt": prompt,
          "temperature": 0.3,         // slightly more flexible hints
          "maxOutputTokens": 400      // enough for a short hint
        })
      }
    );

    const data = await res.json();
    console.log("GEMINI RESPONSE:", data);

    if (data?.candidates && data.candidates.length > 0) {
      return data.candidates[0].content;
    } else {
      return "No hint received";
    }
  } catch (err) {
    console.error(err);
    return "AI failed";
  }
}







