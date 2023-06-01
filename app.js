const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/usersControllers');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64359344f4f4aa99df69f780',
//   };
//   next();
// });
app.use(auth);
app.use(routes);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
