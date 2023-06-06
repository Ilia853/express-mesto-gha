const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi, errors } = require('celebrate');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/usersControllers');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).alphanum().max(30),
    about: Joi.string().min(2).alphanum().max(30),
    /* eslint-disable */
    avatar: Joi.string().min(2).max(30).pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64359344f4f4aa99df69f780',
//   };
//   next();
// });
app.use(auth);
app.use(routes);

// app.all('*', (req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
