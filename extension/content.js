async function getTabUrl() {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}
getTabUrl().then(url => {
  (async () => {
    // Sends a message to the service worker and receives a tip in response
    chrome.runtime.sendMessage({ carbon: url }).then()
    chrome.storage.session.get(["carbon"]).then((result) => {
      let carbon = undefined;
      if (result.carbon && result.carbon.statistics && result.carbon.url == url) {
        if (result.carbon.statistics.co2.renewable) {
          carbon = result.carbon.statistics.co2.renewable.grams
        } else {
          carbon = result.carbon.statistics.co2.grid.grams
        }
      }
      if (carbon != undefined) {
        const carbonSpan = document.getElementById('carbon');
        carbonSpan.innerText = carbon.toFixed(2) + 'g';
      }
    });
  })();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  const entries = Object.entries(changes);

  for (let [key, { oldValue, newValue }] of entries) {
    if (key === 'carbon') {
      let carbon = undefined;
      if (newValue && newValue.statistics) {
        if (newValue.statistics.co2.renewable) {
          carbon = newValue.statistics.co2.renewable.grams
        } else {
          carbon = newValue.statistics.co2.grid.grams
        }
      }
      if (carbon != undefined) {
        const carbonSpan = document.getElementById('carbon');
        carbonSpan.innerText = carbon.toFixed(2) + 'g';
      }
    }
  }

  chrome.storage.session.get((keys) => {
    let score = 0.4 * (1 - keys.carbon.cleanerThan);
    const words = keys.words;
    const totalPageWords = Math.max(words.allPageWords.length, 1); // Empêche la division par zéro
    const totalWordsDetected = Object.values(words.wordsDetected).reduce((a, b) => a + b, 0);
    const ratioWords = Math.max(0, Math.min(1, totalWordsDetected / totalPageWords)); // Clamp la valeur entre 0 et 1
    score += 0.6 * ratioWords;
    score = score.toFixed(2);
    document.getElementById('progress').value = score;
  })
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

        chrome.storage.session.set({ words: result })

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

chrome.tabs.onActivated.addListener(() => {
  if (chrome.storage.session.get(['carbon']) != undefined) {
    chrome.storage.session.remove(['carbon'])
  }
})