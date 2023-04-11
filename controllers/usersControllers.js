const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then(users => res.status(200).send(users));
}

const getUser = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then(user => res.status(200).send(user));
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(200).send(user))
    .catch(err => console.log(err));
}

const updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar })
    .then(user => res.status(200).send(user))
    .catch(err => console.log(err));
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.status(200).send(user))
    .catch(err => console.log(err));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
}