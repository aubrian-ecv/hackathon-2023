// @ts-ignore
chrome.action.onClicked.addListener(function (tab) {
  // @ts-ignore
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["detector.js", "websiteCarbon.js"]
  });
});
