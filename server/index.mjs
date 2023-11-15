import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.get('/carbondata', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL parameter is required.');
    }

    const apiUrl = `https://api.websitecarbon.com/site?url=${encodeURIComponent(url)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching carbon data:', error);
            res.status(500).send('Error fetching carbon data');
        });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});