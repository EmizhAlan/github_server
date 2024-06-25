const express = require('express');
const axios = require('axios');
const mongoose = require('./config');
const Repository = require('./models');
const cors = require('cors'); // Импортируем cors

const app = express();

app.use(express.json());
app.use(cors()); // Используем cors

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

app.get('/repositories', async (req, res) => {
  try {
    const repositories = await Repository.find();
    res.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/repositories/:id', async (req, res) => {
  try {
    const repository = await Repository.findOne({ id: req.params.id });
    if (repository) {
      res.json(repository);
    } else {
      res.status(404).json({ error: 'Repository not found' });
    }
  } catch (error) {
    console.error('Error fetching repository:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
