async function getTabUrl() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
}
console.log(getTabUrl())

function getTitle() { return document.title; }
async function test() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    let ifBodyExist:any = null;

    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getTitle
    })
    .then(injectionResults => {
      for (const {frameId, result} of injectionResults) {
        console.log(`Frame ${frameId} result:`, result);
      }
    });
}
document.getElementById('button').addEventListener('click', test);