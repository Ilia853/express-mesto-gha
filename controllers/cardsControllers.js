const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards));
}

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findOneAndDelete(cardId)
    .then(card => res.status(200).send(card))
    .catch(err => console.log(err));
}

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.status(200).send(card))
    .catch(err => console.log(err));
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(r => res.status(200).send(r))
    .catch(err => console.log(err));
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(r => res.status(200).send(r))
    .catch(err => console.log(err));
}


module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard
}
