chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.carbon) {
        const url = message.carbon

        fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent(url)}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`API request failed with status: ${response}`)
                    throw new Error();
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                chrome.storage.session.set({ carbon: data });
                sendResponse({ success: true }); // Envoyer une réponse au client
            })
            .catch(error => {
                console.error('Error fetching carbon data:', error);
                sendResponse({ success: false, error: 'Error fetching carbon data' }); // Envoyer une réponse d'erreur au client
            });
        return true;
    }
});