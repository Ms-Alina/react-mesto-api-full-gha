const jwt = require('jsonwebtoken');
const ErrorCodeAuth = require('../errors/ErrorCodeAuth');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorCodeAuth('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'yandex-praktikum',
    );
  } catch (err) {
    next(new ErrorCodeAuth('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
