const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const NotAuthorizedError = require('../errors/not-authorized');
const AccessDeniedError = require('../errors/acces-denied');
const {
  setResponse,
  HTTP_201,
  HTTP_200,
} = require('../utils/utils');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => setResponse({
      res,
      messageKey: 'data',
      message: cards,
    }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => setResponse({
      res, messageKey: null, message: card, httpStatus: HTTP_201,
    }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (card.user._id !== req.params.user._id) {
        throw new NotAuthorizedError('Вы не можете удалить чужую карточку');
      }

      setResponse({ res, message: 'Карточка удалена' });
    })
    .catch(next);
};

const likeChange = (res, req, next, like) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    like
      ? { $addToSet: { likes: req.user._id } }
      : { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (card.owner._id !== req.user._id) {
        throw new AccessDeniedError('Вы не можете удалить чужую карточку');
      }

      setResponse({
        res, message: card, messageKey: 'data', httpStatus: HTTP_200,
      });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  likeChange(res, req, next, true);
};

module.exports.dislikeCard = (req, res, next) => {
  likeChange(res, req, next, false);
};
