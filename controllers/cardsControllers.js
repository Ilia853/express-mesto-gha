const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(err => {
      if (err.status === 404) {
        res.status(404).send({ message: err.message })    // надо убрать
        return
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
        return
      }
    })
}

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => {
      if (card) {
        res.status(200).send(card)
      } else {
        res.status(404).send({ message: "Карточка не найдена" })
      }
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректный id карточки" })
        return
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
        return
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
        return
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
        return
      }
    })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      if (card) {
        res.status(200).send(card)
      } else {
        res.status(404).send({ message: "Карточка не найдена" })
      }
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректный id карточки" })     // добавить 404
        return
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
        return
      }
    })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      if (card) {
        res.status(200).send(card)
      } else {
        res.status(404).send({ message: "Карточка не найдена" })
      }
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Некорректный id карточки" })
        return
      } else {
        res.status(500).send({ message: "Ошибка сервера" })
        return
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
