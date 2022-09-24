chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender, message);
  sendResponse("From background");
});