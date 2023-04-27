const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(err => {
      if (err.status === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    })
}

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findOneAndDelete(cardId)
    .then(card => res.status(200).send(card))
    .catch(err => console.log(err))
    .catch(err => {
      if (err.status === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    })
}

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.status(200).send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Некорректные данные карточки" })
      } else if (err.status === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(r => res.status(200).send(r))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректный id карточки" })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(r => res.status(200).send(r))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректный id карточки" })
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
      }
    })
}


module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard
}
