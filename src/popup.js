// CONSTANTS
const button = document.getElementById("button");

// FUNCTIONS
function getWords() {
    const words = ['durabilité', 'vert', 'écologique', 'bio', 'Summary']
    const wordsDetected = {};
    document.body.innerText.split(' ').forEach(word => {
        if (words.indexOf(word) !== -1) {
            if (wordsDetected[word]) {
                wordsDetected[word]++;
            } else {
                wordsDetected[word] = 1;
            }
        }
    });
    return wordsDetected;
}

async function getCarbonData(url) {
    try {
        const apiUrl = `https://api.websitecarbon.com/site?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching carbon data:', error);
        throw error;
    }
}


async function getTabUrl() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
}

button && button.addEventListener("click", async () => {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);

    const carbonSpan = document.getElementById('carbon');
    const url = await getTabUrl();
    getCarbonData(url)
        .then(data => {
            console.log(carbonSpan, data);
            if (carbonSpan) {
                carbonSpan.innerText = data.statistics.co2.grid.grams
            }
        })

    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getWords
    })
        .then(injectionResults => {
            for (const { frameId, result } of injectionResults) {
                console.log(`Frame ${frameId} result:`, result);
                const wordsList = document.getElementById('words-list');
                if (wordsList) {
                    wordsList.innerHTML = '';
                    for (const word in result) {
                        const li = document.createElement('li');
                        li.innerText = `${word} : ${result[word]}`;
                        wordsList.appendChild(li);
                    }
                }
            }
        });
});