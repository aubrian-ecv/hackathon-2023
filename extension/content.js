async function getTabUrl() {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}
getTabUrl().then(url => {
  (async () => {
    // Sends a message to the service worker and receives a tip in response
    chrome.runtime.sendMessage({ carbon: url }).then()
    
    chrome.storage.local.get(["carbon"]).then((result) => {
      console.log("Value currently is ", result.carbon);
      let carbon = 0;
      if (result.carbon.statistics.co2.renewable) {
        carbon = result.carbon.statistics.co2.renewable.grams
      } else {
        carbon = result.carbon.statistics.co2.grid.grams
      }
      
      const carbonSpan = document.getElementById('carbon');
      carbonSpan.innerText = carbon.toFixed(2) + 'g';
    });
  })();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(key, newValue);
  }
});

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
        if (wordsList) {
          wordsList.innerHTML = '';
          for (const word in result.wordsDetected) {
            const li = document.createElement('li');
            li.innerText = `${word} : ${result.wordsDetected[word]}`;
            wordsList.appendChild(li);
          }
        }
      }
    });
})();