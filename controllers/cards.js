const Card = require('../models/card');
const {
  setResponse,
  validateText,
  validateUrl,
  errorResponse,
  validateId,
  HTTP_404,
  HTTP_201,
  HTTP_500
} = require('../utils/utils')

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => setResponse({res, messageKey: 'data', message: cards}))
    .catch(() => setResponse({res, httpStatus: HTTP_500}))
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  let profile = {};
  let errors = [];

  const nameValidation = validateText(name);
  const linkValidation = validateUrl(link)

  if (nameValidation === true) {
    profile['name'] = name;
  } else {
    errors.push(nameValidation)
  }
  if (linkValidation === true) {
    profile['link'] = link;
  } else {
    errors.push(linkValidation)
  }

  if (errorResponse(res, profile, errors)) {
    Card.create({name, link, owner: req.user._id})
      .then(card => setResponse({res, messageKey: null, message: card, httpStatus: HTTP_201}))
      .catch(() => setResponse({res, httpStatus: HTTP_500}))
  }
}

module.exports.deleteCard = (req, res) => {
  const {cardId} = req.params;

  if (validateId(res, cardId)) {
    Card.findByIdAndDelete(cardId)
      .then(card => {
        setResponse(
          card === null ?
            {res, message: 'Карточка не найдена', httpStatus: HTTP_404} :
            {res, message: 'Карточка удалена'}
        )
      })
      .catch(() => setResponse({res, httpStatus: HTTP_500}))
  }
}

module.exports.likeCard = (req, res) => {
  const {cardId} = req.params;

  if (validateId(res, cardId)) {
    Card.findByIdAndUpdate(
      cardId,
      {$addToSet: {likes: req.user._id}},
      {new: true}
    )
      .then(card => {
        setResponse(
          card === null ?
            {res, message: 'Карточка не найдена', httpStatus: HTTP_404} :
            {res, message: card, messageKey: 'data', httpStatus: HTTP_201})
      })
      .catch(() => setResponse({res, httpStatus: HTTP_500}))
  }
}

module.exports.dislikeCard = (req, res) => {
  const {cardId} = req.params;

  if (validateId(res, cardId)) {
    Card.findByIdAndUpdate(
      cardId,
      {$pull: {likes: req.user._id}},
      {new: true}
    )
      .then(card => {
        setResponse(
          card === null ?
            {res, message: 'Карточка не найдена', httpStatus: HTTP_404} :
            {res, message: card, messageKey: 'data'})
      })
      .catch(() => setResponse({res, httpStatus: HTTP_500}))
  }
}