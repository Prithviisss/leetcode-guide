chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_HINTS") {
    console.log("📩 Received problem in background.js");
    console.log("Title:", message.title);
    console.log("Description:", message.description);

    // temporary fake response
    sendResponse({
      success: true,
      hint: "This is where AI-generated hints will come."
    });
  }
});
