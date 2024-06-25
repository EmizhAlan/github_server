const express = require('express');
const axios = require('axios');
const mongoose = require('./config'); // Убедитесь, что путь правильный
const Repository = require('./models'); // Убедитесь, что путь правильный
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const GITHUB_TRENDING_URL = 'https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc';
let syncInterval;
const SYNC_INTERVAL_MINUTES = 10;

const fetchTrendingRepositories = async () => {
  try {
    const response = await axios.get(GITHUB_TRENDING_URL);
    const repos = response.data.items.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      stars: repo.stargazers_count,
      url: repo.html_url,
    }));
    await Repository.insertMany(repos, { ordered: false, upsert: true });
  } catch (error) {
    console.error('Error fetching trending repositories:', error);
  }
};

const startSync = () => {
  clearInterval(syncInterval);
  fetchTrendingRepositories();
  syncInterval = setInterval(fetchTrendingRepositories, SYNC_INTERVAL_MINUTES * 60 * 1000);
};

app.use('/repositories', require('./routes/repositories'));

app.post('/sync', (req, res) => {
  startSync();
  res.json({ message: 'Sync started' });
});

const PORT = process.env.PORT || 3000;

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startSync();
  });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
