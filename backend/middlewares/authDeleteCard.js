const Card = require('../models/card');
const customError = require('../errors/customError');

module.exports = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        next(new customError.ErrorCodeNotFound('Карточки с указанным id не существует'));
      }
      if (card.owner.toString() !== req.user._id) {
        next(new customError.ErrorCodeBanned('У вас нет прав на удаление чужой карточки'));
      }
      return next();
    })
    .catch(next);
};
