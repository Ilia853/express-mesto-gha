const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then(users => res.status(200).send(users));
}

const getUser = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then(user => res.status(200).send(user));
}

const createUser = (req, res) => {
  User.create({...req.body})
    .then(user => user.status(200).send(req.body));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
}