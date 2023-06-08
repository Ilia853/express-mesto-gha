const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);// (err) => res.status(500).send({ message: 'Ошибка сервера', error: err })
};

const deleteCard = (req, res, next) => {
  const { owner } = req.body;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else if (owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(res.status(200).send(card));
      } else if (owner !== req.user._id) {
        throw new ForbiddenError('нет прав на удаление карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Некорректные данные карточки' });
        next(new BadRequestError('Некорректные данные карточки'));
      } else {
        // res.status(500).send({ message: 'Ошибка сервера' });
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        // res.status(404).send({ message: 'Карточка не найдена' });
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Некорректный id карточки' });
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        // res.status(500).send({ message: 'Ошибка сервера' });
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        // res.status(404).send({ message: 'Карточка не найдена' });
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Некорректный id карточки' });
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        // res.status(500).send({ message: 'Ошибка сервера' });
        next(err);
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
