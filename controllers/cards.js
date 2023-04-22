const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(() => res.status(500).send({message: 'На сервере произошла ошибка'}))
}

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;

  Card.create({name, link, owner: req.user._id})
    .then(card => res.send({data: card}))
    .catch(() => res.status(500).send({message: 'На сервере произошла ошибка'}));
}

module.exports.deleteCard = (req, res) => {
  console.log(req.params)
  console.log(req.params.cardId)
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.status(204).send({message: 'Карточка удалена'}))
    .catch(() => res.status(500).send({message: 'На сервере произошла ошибка'}));
}
