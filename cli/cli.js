#!/usr/bin/env node

const axios = require('axios');
const yargs = require('yargs');

const apiUrl = 'http://localhost:3000';

const argv = yargs
  .command('get [id]', 'Get repository by ID or get all repositories', yargs => {
    yargs.positional('id', {
      describe: 'Repository ID',
      type: 'string',
    });
  })
  .command('sync', 'Start sync with GitHub')
  .help()
  .argv;

if (argv._[0] === 'get') {
  if (argv.id) {
    axios.get(`${apiUrl}/repositories/${argv.id}`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching repository:', error);
      });
  } else {
    axios.get(`${apiUrl}/repositories`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching repositories:', error);
      });
  }
} else if (argv._[0] === 'sync') {
  axios.post(`${apiUrl}/sync`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error starting sync:', error);
    });
} else {
  yargs.showHelp();
}
