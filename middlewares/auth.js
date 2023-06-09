const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'kamikaza');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;

  next();
};

module.exports = {
  auth,
};
