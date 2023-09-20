require('dotenv').config();
const jwt = require('jsonwebtoken');
const ErrorCodeAuth = require('../errors/ErrorCodeAuth');

const { NODE_ENV, PROD_KEY = 'prod-key', DEV_KEY = 'dev-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorCodeAuth('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? PROD_KEY : DEV_KEY);
    req.user = payload;
  } catch (err) {
    return next(new ErrorCodeAuth('Необходима авторизация'));
  }

  // req.user = payload;

  return next();
};
