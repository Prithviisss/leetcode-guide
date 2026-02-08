chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_HINT") {
    console.log("Received problem:", req.title);

    // Fake AI response for now
    const hint = `
Think about:
• Using a hashmap
• Trading space for time
• One-pass solution

Try to reason about what you need to know BEFORE you reach an index.
    `;

    sendResponse({ hint });
  }
});

