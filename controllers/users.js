const User = require('../models/user');

module.exports.getUser = (req, res) => {
  const {userId} = req.params;

  (typeof userId  !== 'undefined' ? User.findById(userId ) : User.find({}))
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({message: 'На сервере произошла ошибка'}))
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'На сервере произошла ошибка'}));
};