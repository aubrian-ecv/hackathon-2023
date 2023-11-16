document.getElementById('aboutButton').addEventListener('click', () => {
  chrome.tabs.create({
    url: "about.html"
  });
})

chrome.storage.session.get((keys) => {
  if (keys.words) {
    const words = keys.words;
    let score = 0
    if (words.totalWeight != 0) {
      document.getElementById('words').style.display = "block"
      const totalPageWords = Math.max(words.allPageWords.length, 1); // Empêche la division par zéro
      const totalWordsDetected = Object.values(words.wordsDetected).reduce((a, b) => a + b, 0);
      const ratioWords = (totalWordsDetected / totalPageWords) * 1000; // Clamp la valeur entre 0 et 1

      // Calcul du ratio poids/mots
      const weightRatio = words.totalWeight / totalWordsDetected;

      console.log(weightRatio)
      score = ratioWords + 0.15 * weightRatio + 0.15 * words.totalWeight

      if (score < 30) {
        document.getElementById('score').style.color = "#48DC68"
      } else if (score < 60) {
        document.getElementById('score').style.color = "#EAD82F"
      } else if (score < 100) {
        document.getElementById('score').style.color = "#EA892F"
      } else {
        document.getElementById('score').style.color = "#EA2F2F"
      }
      document.getElementById('score').innerText = score.toFixed(2);
    } else {
      document.getElementById('words').style.display = "none"
      document.getElementById('score').style.color = "#48DC68"
      document.getElementById('score').innerText = "0"
    }
  }
})




async function getTabUrl() {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}
getTabUrl().then(url => {
  (async () => {
    try {
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
          carbonSpan.innerText = carbon.toFixed(2) + 'g CO₂/visite';
        }
      });
    } catch { }
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
        carbonSpan.innerText = carbon.toFixed(2) + 'g CO₂/visite';
      }
    }
  }

  chrome.storage.session.get((keys) => {
    const words = keys.words;

    if (keys.words) {
      let score = 0
      if (words.totalWeight != 0) {
        document.getElementById('words').style.display = "block"
        const totalPageWords = Math.max(words.allPageWords.length, 1); // Empêche la division par zéro
        const totalWordsDetected = Object.values(words.wordsDetected).reduce((a, b) => a + b, 0);
        const ratioWords = (totalWordsDetected / totalPageWords) * 1000; // Clamp la valeur entre 0 et 1
        // Calcul du ratio poids/mots
        const weightRatio = words.totalWeight / totalWordsDetected;

        console.log(weightRatio)
        score = ratioWords + 0.15 * weightRatio + 0.15 * words.totalWeight

        if (score < 30) {
          document.getElementById('score').style.color = "#48DC68"
        } else if (score < 60) {
          document.getElementById('score').style.color = "#EAD82F"
        } else if (score < 100) {
          document.getElementById('score').style.color = "#EA892F"
        } else {
          document.getElementById('score').style.color = "#EA2F2F"
        }
        document.getElementById('score').innerText = score.toFixed(2);
      } else {
        document.getElementById('words').style.display = "none"
        document.getElementById('score').style.color = "#48DC68"
        document.getElementById('score').innerText = "0"
      }
    }
  })
});

function getWords() {
  const words = {
    "éco-friendly": 30,
    "eco-friendly": 30,
    "durabilité": 4,
    "durable": 6,
    "bio": 12,
    "naturel": 12,
    "vert": 2,
    "verte": 4,
    "écologique": 12,
    "écologie": 12,
    "ecologique": 12,
    "ecologie": 12,
    "écologiques": 12,
    "ecologiques": 12,
    "biodégradable": 8,
    "biodegradable": 8,
    "biodégradables": 8,
    "biodegradable": 8,
    "recyclable": 8,
    "recyclé": 8,
    "recycle": 8,
    "recycler": 6,
    "éthique": 4,
    "ethique": 4,
    "responsable": 12,
    "nature": 4,
    "sain": 4,
    "vertueux": 4,
    "équitable": 2,
    "equitable": 2,
    "solaire": 2,
    "respectueux": 6,
    "respectueuses": 6,
    "respect": 4,
    "neutre": 2,
    "économie": 2,
    "economie": 2,
    "économies": 2,
    "economies": 2,
    "végétale": 8,
    "vegetale": 8,
    "d'origine": 2,
    "naturels": 12,
    "naturelle": 12,
    "environnement": 4,
    "l’environnement": 4,
    "éco-conscient": 12,
    "eco-conscient": 12,
    "climatiquement": 20,
    "climat": 2
  }
  const wordsDetected = {};
  const allPageWords = document.body.innerText.split(/\s+/);

  let totalWeight = 0; // Initialise le poids total à 0

  allPageWords.forEach(word => {
    const matchedWord = word.toLowerCase();

    if (words.hasOwnProperty(matchedWord)) {
      if (wordsDetected[matchedWord]) {
        wordsDetected[matchedWord]++;
      } else {
        wordsDetected[matchedWord] = 1;
      }
      totalWeight += words[matchedWord]; // Ajoute le poids du mot au total
    }
  });
  return { allPageWords, wordsDetected, totalWeight };
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
          const wordResults = [];
          for (const word in result.wordsDetected) {
            wordResults.push({ word, count: result.wordsDetected[word] });
          }

          // Trier le tableau en fonction du nombre de résultats (en ordre décroissant)
          wordResults.sort((a, b) => b.count - a.count);
          for (const { word, count } of wordResults) {
            const li = document.createElement('li');
            li.innerText = `${word} : ${count}`;
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