const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose
  .connect('')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
