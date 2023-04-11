const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index')
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  req.user = {
    _id: '64359344f4f4aa99df69f780'
  };
  next();
});
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});