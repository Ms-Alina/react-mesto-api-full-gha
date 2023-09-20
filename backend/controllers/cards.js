const Card = require('../models/card');
const customError = require('../errors/customError');

const checkCard = (card, res) => {
  if (!card) {
    throw new customError.ErrorCodeNotFound('Нет карточки с таким id');
  }
  return res.status(200).send(card);
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => res.status(201).send(newCard))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new customError.ErrorCodeBadRequest('Переданы некорректные данные при создании карточки'));
      }
      return next(error);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .orFail(() => {
      throw new customError.ErrorCodeNotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      }
      return next(new customError.ErrorCodeBanned('В доступе отказано'));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => checkCard(card, res))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => checkCard(card, res))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
