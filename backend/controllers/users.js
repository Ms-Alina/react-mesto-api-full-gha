require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCodeBadRequest = require('../errors/ErrorCodeBadRequest');
const ErrorCodeConflict = require('../errors/ErrorCodeConflict');
const ErrorCodeNotFound = require('../errors/ErrorCodeNotFound');
const ErrorCodeAuth = require('../errors/ErrorCodeAuth');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  // User.find({})
  //   .then((users) => res.status(200).send(users))
  //   .catch(next);
  const { userList } = {};
  User.find(userList)
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const findUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      throw new ErrorCodeNotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorCodeBadRequest('Переданы некорректные данные'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorCodeNotFound('Пользователь по указанному _id не найден'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(201).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ErrorCodeConflict('Этот email уже зарегистрирован'));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new ErrorCodeNotFound('Пользователь с указанным _id не найден');
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrorCodeBadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new ErrorCodeNotFound('Пользователь с указанным _id не найден');
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ErrorCodeBadRequest('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new ErrorCodeNotFound('Пользователь с таким id не найден');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorCodeAuth('Неверные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new ErrorCodeAuth('Неверные почта или пароль'));
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'yandex-praktikum',
          { expiresIn: '7d' },
        );
        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  findUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
  login,
};
