const Card = require('../models/card');
const {
  setResponse,
  errorResponse,
  HTTP_404,
  HTTP_201,
  HTTP_200,
} = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => setResponse({ res, messageKey: 'data', message: cards }))
    .catch((errors) => errorResponse(res, errors));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => setResponse({
      res, messageKey: null, message: card, httpStatus: HTTP_201,
    }))
    .catch((errors) => errorResponse(res, errors));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      setResponse(
        card === null
          ? { res, message: 'Карточка не найдена', httpStatus: HTTP_404 }
          : { res, message: 'Карточка удалена' },
      );
    })
    .catch((errors) => errorResponse(res, errors));
};

const likeChange = (res, req, like) => {
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
      setResponse(
        card === null
          ? { res, message: 'Карточка не найдена', httpStatus: HTTP_404 }
          : {
            res, message: card, messageKey: 'data', httpStatus: like ? HTTP_201 : HTTP_200,
          },
      );
    })
    .catch((errors) => errorResponse(res, errors));
};

module.exports.likeCard = (req, res) => {
  likeChange(res, req, true);
};

module.exports.dislikeCard = (req, res) => {
  likeChange(res, req, false);
};
