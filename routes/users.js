const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getUserById,
  // createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/usersControllers');

router.get('/', getUsers);

router.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUserById);

// router.post('/', createUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    /* eslint-disable */
    avatar: Joi.string().min(2).max(30).pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/),
    /* eslint-enable */
  }),
}), updateAvatar);

module.exports = router;
