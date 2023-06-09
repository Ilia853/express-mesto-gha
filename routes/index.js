const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { Joi, celebrate } = require('celebrate');
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/usersControllers');

const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).alphanum().max(30),
    about: Joi.string().min(2).alphanum().max(30),
    /* eslint-disable */
    avatar: Joi.string().min(2).max(30).pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/),
    /* eslint-enable */
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Станица не найдена'));
});

module.exports = router;
