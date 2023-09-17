const authRouter = require('express').Router();
const { login, createUser } = require('../controllers/users');

const {
  validationCreateUser,
  validationLogin,
} = require('../middlewares/validation');

authRouter.post('/signin', validationLogin, login);
authRouter.post('/signup', validationCreateUser, createUser);

module.exports = authRouter;
