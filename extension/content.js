(async () => {
    // Sends a message to the service worker and receives a tip in response
    const { data } = await chrome.runtime.sendMessage({ greeting: 'carbon' });
  
    console.log(data)
  })();
  
  