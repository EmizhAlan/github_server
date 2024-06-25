const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dzedunmao346:tAkt4hGMuxelXdcc@grantapp.y4yzhdu.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
