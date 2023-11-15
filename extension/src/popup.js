// CONSTANTS
const button = document.getElementById("button");

// FUNCTIONS
function getWords() {
    const words = [
        'Durabilité',
        'Écologie',
        'Environnement',
        'Biologique',
        'Recyclage',
        'Compostage',
        'Biodiversité',
        'Écosystème',
        'Renouvelables',
        'Conservation',
        'Carbone',
        'Bioénergie',
        'Éolienne',
        'Solaire',
        'Hydroélectricité',
        'Biomasse',
        'Géothermie',
        'Ressources',
        'Habitat',
        'Faune',
        'Flore',
        'Protection',
        'Climatique',
        'Serre',
        'Neutralité',
        'ZéroDéchet',
        'Responsable',
        'Éthique',
        'Mobilité',
        'Permaculture',
        'Aquaculture',
        'Foresterie',
        'Pêche',
        'Écoconception',
        'Écolabel',
        'Pollution',
        'Déforestation',
        'Reforestation',
        'Réutilisation',
        'Valorisation',
        'Épuration',
        'Gestion',
        'Économie',
        'Écotourisme',
        'Biologique',
        'Équitables',
        'Équitable',
        'Environnementale',
        'Éducation',
        'Activisme',
        'Technologie',
        'Électrique',
        'Thermique',
        'Énergétique',
        'Hydrique',
        'Risques',
        'Sociétale',
        'Affaires',
        'Innovation',
        'Urbanisme',
        'Bâtiment',
        'Architecture',
        'Ville',
        'Écosocialisme',
        'Transition',
        'Réseaux',
        'Capteurs',
        'Indicateur',
        'CycleVie',
        'ÉconomieBleue',
        'ÉconomieVerte',
        'Biomimétisme',
        'Corridor',
        'Propre',
        'Eaux',
        'QualitéAir',
        'Conservation',
        'Refuge',
        'Régénérative',
        'Végétalisé',
        'Jardinage',
        'Transport',
        'Covoiturage',
        'MicroMobilité',
        'MarchéCarbone',
        'CréditCarbone',
        'Compensation',
        'Investissement',
        'FondsVert'
    ];
    const wordsDetected = {};
    const allPageWords = document.body.innerText.split(/\s+/);
    allPageWords.forEach(word => {
        if (words.map(w => w.toLowerCase()).indexOf(word.toLowerCase()) !== -1) {

            const matchedWord = word.toLowerCase();

            if (wordsDetected[matchedWord]) {
                wordsDetected[matchedWord]++;
            } else {
                wordsDetected[matchedWord] = 1;
            }
        }
    });

    return { allPageWords, wordsDetected };
}

function getCarbonData() {
    console.log(window.location.href);
    const apiUrl = `https://d597-195-135-0-87.ngrok-free.app/carbondata?url=${encodeURIComponent(window.location.href)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching carbon data:', error);
            throw error;
        });
}

async function getTabUrl() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
}

(async () => {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await chrome.tabs.query(queryOptions);

    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getWords
    })
        .then(injectionResults => {
            for (const { frameId, result } of injectionResults) {
                console.log(`Frame ${frameId} result:`, result);
                const wordsList = document.getElementById('words-list');
                const carbonSpan = document.getElementById('carbon');
                if (wordsList) {
                    wordsList.innerHTML = '';
                    for (const word in result.wordsDetected) {
                        const li = document.createElement('li');
                        li.innerText = `${word} : ${result.wordsDetected[word]}`;
                        wordsList.appendChild(li);
                    }
                }

                if (carbonSpan) {
                    carbonSpan.innerText = result.allPageWords.length;
                }
            }
        });

    chrome.tabs.executeScript({
        target: { tabId: tabs[0].id },
        func: getCarbonData
    })
        .then(injectionResults => {
            for (const { frameId, result } of injectionResults) {
                console.log(result);
            }
        });
})();