class WebsiteCarbonAPI {
    async getCarbonData(url: string) {
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
  }

  
  
/**
  // Exemple d'utilisation de la classe pour récupérer les informations du site.
  const websiteCarbon = new WebsiteCarbonAPI();
  const siteUrl = 'https://mywebsite.com/';
  
  websiteCarbon.getCarbonData(siteUrl)
    .then(data => {
      console.log('Données de carbone du site:', data);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données de carbone:', error);
    });
*/