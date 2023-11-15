chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.carbon) {
        const url = message.carbon

        fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent(url)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            chrome.storage.local.set({ carbon: data });
        })
        .catch(error => {
            console.error('Error fetching carbon data:', error);
            response.status(500).send('Error fetching carbon data');
        });
        return true;
    }
  });