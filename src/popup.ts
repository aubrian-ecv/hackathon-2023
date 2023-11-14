document.addEventListener('DOMContentLoaded', async () => {
    const wordCount = await chrome.storage.local.get('wordCount');
    alert(JSON.stringify(wordCount));
})