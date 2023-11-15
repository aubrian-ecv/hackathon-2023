const getCarbonData = async () => {
    const response = await fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent('https://www.websitecarbon.com/')}`);
    const data = await response.json();
    return chrome.storage.local.set({ carbon: data });
  };


  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.greeting === 'carbon') {
        // chrome.storage.local.get('carbon').then(sendResponse);
        // console.log(sendResponse)
        fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent('https://www.websitecarbon.com/')}`)
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
            res.status(500).send('Error fetching carbon data');
        });
        return true;
    }
  });