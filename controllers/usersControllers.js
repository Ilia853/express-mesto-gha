// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const Conflict = require('../errors/conflict-err');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // Promise.reject(new Error('Неправильные почта или пароль'));
        throw new BadRequestError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            // return Promise.reject(new Error('Неправильные почта или пароль'));
            throw new BadRequestError('Неправильные почта или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user.id },
        'kamikaza',
        { expiresIn: '7d' },
      );
      res.send({ message: 'вот токен', token });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      // res.status(401).send({ message: err.message });
      next(new UnauthorizedError('Ошибка авторизации, некорректный токен'));
    });
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(next);

const getUser = (req, res, next) => {
  // const { userId } = req.params;
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        // res.status(404).send({ message: 'Пользователь не найден' });
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Некорректный id пользователя' });
        next(new BadRequestError('Некорректный id пользователя')); // BadRequestError
      } else {
        // res.status(500).send({ message: 'Ошибка сервера' });
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Некорректные данные пользователя' });
        next(new BadRequestError('Некорректные данные пользователя'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else {
        // res.status(500).send({ message: 'Ошибка сервера' });
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        // res.status(404).send({ message: 'Пользователь не найден' });
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Некорректные данные пользователя' });
        next(new BadRequestError('Некорректные данные пользователя'));
      } else {
        // res.status(500).send({ message: 'Ошибка сервера' });
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        // res.status(404).send({ message: 'Пользователь не найден' });
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Некорректная ссылка на аватар пользователя' });
        next(new BadRequestError('Некорректная ссылка на аватар пользователя'));
      } else {
        // res.status(500).send({ message: 'Ошибка сервера' });
        next(err);
      }
    });
};

module.exports = {
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
