const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => {
      if (err.status === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    })
}

const getUser = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then(user => { if (user) { res.status(200).send(user) } else { res.status(404).send({message: 'Пользователь не найден'}) } })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректный id пользователя" })
      } else if (err.status === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    })
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(200).send(user))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Некорректные данные пользователя" })
      } else if (err.status === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    });
}

const updateUser = (req, res) => {
  const { _id, name, about, avatar } = req.body;
  return User.findByIdAndUpdate(_id, { name, about, avatar })
  .then(user => res.status(200).send(user))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: "Некорректные данные пользователя" })
    } else if (err.status === 404) {
      res.status(404).send({ message: err.message })
    } else {
      res.status(500).send({ message: "Ошибка сервера" })
    }
  });
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.status(200).send(user))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректная ссылка на аватар пользователя" })
      } else if (err.status === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
}