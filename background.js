console.log("Background service worker loaded");

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log("Message received in background:", req);

  if (req.type === "GET_HINT") {
    sendResponse({ hint: "This is a test hint from background.js" });
    return true;
  }
});



