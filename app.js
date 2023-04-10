const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index')

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {});

const app = express();

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});