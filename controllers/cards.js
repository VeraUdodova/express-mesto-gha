const Card = require('../models/card');
const {setResponse, validateText, validateUrl, errorResponse} = require('../utils/utils')

module.exports.getCard = (req, res) => {
  Card.find({})
    .then(cards => setResponse({res, messageKey: 'data', message: cards}))
    .catch(() => setResponse({res, httpStatus: 500}))
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
      .then(card => setResponse({res, messageKey: 'id', message: card._id, httpStatus: 201}))
      .catch(() => setResponse({res, httpStatus: 500}))
  }
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => setResponse({res, message: 'Карточка удалена', httpStatus: 204}))
    .catch(() => setResponse({res, httpStatus: 500}))
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
    .then(() => setResponse({res, message: 'Лайк установлен', httpStatus: 204}))
    .catch(() => setResponse({res, httpStatus: 500}))
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
    .then(() => setResponse({res, message: 'Лайк удален', httpStatus: 204}))
    .catch(() => setResponse({res, httpStatus: 500}))
}
