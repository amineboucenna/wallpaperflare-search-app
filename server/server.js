const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

let links = [];


app.get('',(req, res) => {
  return res.redirect('http://localhost:5173')
})

app.get('/api/search', async (req, res) => {
  const searchQuery = req.query.query || 'space';
  const limit = req.query.limit || 12;
  const searchURL = `https://www.wallpaperflare.com/search?wallpaper=${searchQuery}&sort=relevance`;

  try {
    const response = await axios.get(searchURL);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const anchorTags = $('a[itemprop="url"][href]');
      let count = 0;
      links = [];

      anchorTags.each((index, element) => {
        if (count >= limit) { // Check against the provided limit
          return false;
        }
        const img = $(element).find('img');
        if (img && img.attr('data-src')) {
          const link = img.attr('data-src');
          links.push(link);
          count++;
        }
      });

      res.json(links);
    } else {
      console.log(`Failed to retrieve the page. Status code: ${response.status}`);
      res.status(500).json({ error: 'Failed to retrieve wallpapers' });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api', (req, res) => {
  res.json(links);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
