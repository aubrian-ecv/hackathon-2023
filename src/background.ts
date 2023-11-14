// background.ts
// @ts-ignore
chrome.action.onClicked.addListener((tab) => {
  // @ts-ignore
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: countWordsInTab
  });
});

function countWordsInTab() {
  // @ts-ignore
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    alert('coucou')
    if (!tabs[0].id) return;
    // @ts-ignore
    chrome.tabs.sendMessage(tabs[0].id, { action: 'countWords' }, (response) => {
      // @ts-ignore
      chrome.storage.local.set({ 'wordCount': response });
    });
  });
}
