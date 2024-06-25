const mongoose = require('./config');
const { Schema } = mongoose;

const repositorySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Repository = mongoose.model('Repository', repositorySchema);

module.exports = Repository;
