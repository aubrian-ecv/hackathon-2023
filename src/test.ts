async function getTabUrl() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
}
console.log(getTabUrl())

async function changeBackgroundColorToActiveTab() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {document.body.style.backgroundColor = 'red';}
    });
}
changeBackgroundColorToActiveTab()